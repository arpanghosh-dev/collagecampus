import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { env } from "../config/env";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/appError";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new AppError("Unauthorized", 401);

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) throw new AppError("User no longer exists", 401);

      req.user = user;
      next();
    } catch (error) {
      throw new AppError("Invalid or expired token", 401);
    }
  }
);