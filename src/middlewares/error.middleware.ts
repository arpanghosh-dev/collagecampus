import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { ErrorResponse } from "../utils/apiResponse";

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return ErrorResponse.send(
      res,
      err.message,
      err.statusCode
    );
  }

  console.error(err);

  return ErrorResponse.send(
    res,
    "Internal Server Error",
    500
  );

};