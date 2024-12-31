// utils/try.catch.utils.ts

import { Response } from "express";
import ApiError from "./api.error";

// utils/interfaces.ts
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}


// Define the wrapper function that handles async errors and response
async function tryCatchWrapper<T>(asyncFn: () => Promise<ApiResponse<T>>, res: Response): Promise<void> {
    try {
        const result: ApiResponse<T> = await asyncFn();

        // Send success response if everything is fine
        res.status(result.status).json({
            message: result.message,
            data: result.data,
            status: result.status,
            error: false,
            stack: null,
        });
    } catch (error: any) { // `unknown` type allows better type checking
        // Handle the case where `error` is an instance of `ApiError`
        if (error instanceof ApiError) {
            res.status(error.status).json({
                message: error.message,
                data: null,
                status: error.status,
                error: true,
                stack: error.stack || null,
            });
        } else {
            // Fallback for unexpected error types (not an instance of `Error`)
            res.status(500).json({
                message: "Unknown error",
                data: null,
                status: 500,
                stack: String(error),
                error: true,
            });
        }
    }
}

export default tryCatchWrapper;
