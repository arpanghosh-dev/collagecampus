import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6),
});