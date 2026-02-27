import jwt from "jsonwebtoken";
import { env } from "./env";

export const generateAccessToken = (id: string) =>
  jwt.sign({ id }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

export const generateRefreshToken = (id: string) =>
  jwt.sign({ id }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });