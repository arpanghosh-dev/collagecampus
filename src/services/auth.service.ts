import User, { IUser } from "../models/user.model";
import RefreshToken from "../models/refreshToken.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../config/jwt";
import { AppError } from "../utils/appError";
import { sendResetPasswordEmail } from "../utils/mailer";


const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export const registerUser = async (data: Partial<IUser>) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new AppError("Email already exists", 400, "EMAIL_EXISTS");

  if (!data.password) throw new AppError("Password is required", 400, "PASSWORD_REQUIRED");
  const hashed = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashed,
  });

  return user;
};

export const loginUser = async (email: string, password: string, deviceInfo: { ip?: string, name?: string }) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const hashedToken = hashToken(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceInfo
  });

  return { accessToken, refreshToken, user };
};

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export const refreshUserToken = async (token: string, deviceInfo: { ip?: string, name?: string }) => {
  let decoded: DecodedToken;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as DecodedToken;
  } catch (err) {
    throw new AppError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
  }

  const hashedToken = hashToken(token);
  const refreshTokenDoc = await RefreshToken.findOne({ token: hashedToken });

  if (!refreshTokenDoc) {
    // Potential reuse detection: revoke all tokens for this user
    await RefreshToken.deleteMany({ userId: decoded.id });
    throw new AppError("Refresh token reuse detected. All sessions revoked.", 401, "TOKEN_REUSE");
  }

  // Rotate token
  const newAccessToken = generateAccessToken(decoded.id);
  const newRefreshToken = generateRefreshToken(decoded.id);
  const newHashedToken = hashToken(newRefreshToken);

  refreshTokenDoc.token = newHashedToken;
  refreshTokenDoc.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  refreshTokenDoc.deviceInfo = deviceInfo; // Update device info on refresh
  await refreshTokenDoc.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (token: string) => {
  const hashedToken = hashToken(token);
  await RefreshToken.findOneAndDelete({ token: hashedToken });
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = hashToken(resetToken);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  try {
    await sendResetPasswordEmail(email, resetToken);
  } catch (err) {
    console.error("Nodemailer Error:", err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new AppError("Email could not be sent", 500, "EMAIL_NOT_SENT");
  }

  return resetToken;
};

export const resetPassword = async (
  token: string,
  newPassword: string
) => {

  const hashedToken = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: new Date() },
  });

  if (!user) throw new AppError("Token invalid or expired", 400, "INVALID_OR_EXPIRED_TOKEN");

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
};