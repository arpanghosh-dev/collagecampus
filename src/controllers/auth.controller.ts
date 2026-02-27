import * as authService from "../services/auth.service";
import { Request, Response } from 'express';
import { asyncHandler } from "../utils/asyncHandler";
import { SuccessResponse } from "../utils/apiResponse";
import { AppError } from "../utils/appError";
import { z } from "zod";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/auth.validator";

type RegisterBody = z.infer<typeof registerSchema>;
type LoginBody = z.infer<typeof loginSchema>;
type RefreshBody = z.infer<typeof refreshTokenSchema>;

export const register = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as RegisterBody;
  const user = await authService.registerUser(body);
  return SuccessResponse.send(res, user, "User registered successfully", 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as LoginBody;
  const deviceInfo = {
    ip: req.ip || "unknown",
    name: (req.headers["user-agent"] as string) || "unknown",
  };

  const { accessToken, refreshToken, user } = await authService.loginUser(
    body.email,
    body.password,
    deviceInfo
  );


  // Return both tokens in body for Mobile/Multi-platform support
  return SuccessResponse.send(
    res,
    { accessToken, refreshToken, user },
    "Login successful"
  );
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as RefreshBody;
  const token = body.refreshToken;


  if (!token) {
    throw new AppError("Refresh token missing", 401, "REFRESH_TOKEN_MISSING");
  }

  const deviceInfo = {
    ip: req.ip || "unknown",
    name: (req.headers["user-agent"] as string) || "unknown",
  };

  const { accessToken, refreshToken } = await authService.refreshUserToken(
    token,
    deviceInfo
  );


  // Return new tokens in body
  return SuccessResponse.send(
    res,
    { accessToken, refreshToken },
    "Token refreshed successfully"
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as RefreshBody;
  const token = body.refreshToken;

  if (token) {
    await authService.logoutUser(token);
  }

  return SuccessResponse.send(res, null, "Logged out successfully");
});

export const forgot = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as { email: string };
  const token = await authService.forgotPassword(body.email);
  return SuccessResponse.send(res, { resetToken: token }, "Reset token sent to email");
});

export const reset = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as { password: string };
  await authService.resetPassword(
    req.params.token as string,
    body.password
  );
  return SuccessResponse.send(res, null, "Password updated successfully");
});

