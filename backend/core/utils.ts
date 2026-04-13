import { Response } from 'express';


export class AppError extends Error {
    constructor(
        public statusCode: number, // 200, 400, etc
        public code: string, // used for regular response (eg: PASSWORD_WRONG, USERNAME_TAKEN)
    ) {
        super(code);
        this.statusCode = statusCode;
    }
}

export const ErrorResponses = {
    SUCCESS: new AppError(200, "SUCCESS"),


    INVALID_INPUT: new AppError(400, "INVALID_INPUT"),
    INVALID_CREDENTIALS: new AppError(400, "INVALID_CREDENTIALS"),
    USERNAME_TAKEN: new AppError(400, "USERNAME_TAKEN"),


    UNAUTHORIZED: new AppError(401, "UNAUTHORIZED"),

    FORBIDDEN: new AppError(403, "FORBIDDEN"),

    NOT_FOUND: new AppError(404, "NOT_FOUND"),

    INTERNAL_SERVER_ERROR: new AppError(500, "INTERNAL_SERVER_ERROR"),
}

export const E = (error?: any) => {
    throw error ?? ErrorResponses.INTERNAL_SERVER_ERROR;

}


export const S = (res: Response, data?: any) => {
    return res.status(200).json({
        success: true,
        code: "SUCCESS",
        ...data
    });
}

export const safelyUnwrap = async <T>(fn: ()=>Promise<T>): Promise<T | undefined> => {
    try {
        return await fn();
    } catch (error) {
        return undefined;
    }
}