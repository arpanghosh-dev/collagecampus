export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errorCode: string | number;
  public details: unknown;

  constructor(message: string, statusCode: number, errorCode: string | number = "ERROR", details: unknown = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}



