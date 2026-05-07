import { Request, Response, NextFunction } from "express";
import unauthorizedError from "../../domain/errors/unauthorized-error";

export const isAuthenticated = (req: Request & { auth?: { userId?: string | null } }, res: Response, next: NextFunction) => {
    if (!req.auth?.userId) {
        throw new unauthorizedError("Unauthorized");
    }
    next();
}