import { Request, Response, NextFunction } from "express";
import ForbiddenError from "../../domain/errors/forbidden-error";

type AuthRequest = Request & { 
    auth?: { 
        userId?: string | null;
        sessionId?: string;
        sessionClaims?: Record<string, any>;
    } 
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if(!(req?.auth?.sessionClaims?.role !== "admin")){
        throw new ForbiddenError("forbidden");
    }
    next();
}