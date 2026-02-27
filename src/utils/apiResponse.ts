import { Response } from "express";

export interface ApiResponse<T> {
    code: number;
    success: boolean;
    message: string;
    data: T | null;
}

export class SuccessResponse<T> {
    static send<T>(
        res: Response,
        data: T,
        message: string = "Success",
        statusCode: number = 200
    ) {
        const response: ApiResponse<T> = {
            code: statusCode,
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }
}

export class ErrorResponse {
    static send(
        res: Response,
        message: string = "Error",
        statusCode: number = 500
    ) {
        const response: ApiResponse<null> = {
            code: statusCode,
            success: false,
            message,
            data: null,
        };
        return res.status(statusCode).json(response);
    }
}
