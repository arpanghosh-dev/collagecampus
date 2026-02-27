import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/appError";

export const validate =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse(req.body);
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.issues
                        .map((i) => `${i.path.join(".")}: ${i.message}`)
                        .join(", ");
                    return next(new AppError(message, 400, "VALIDATION_ERROR", error.issues));
                }

                next(error);
            }
        };
