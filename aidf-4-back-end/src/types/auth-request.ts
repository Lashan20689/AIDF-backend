import { Request } from "express";
//make to create the error for the user when we dont get user id from clerk session in req.auth.userId
export type AuthRequest = Request & { 
    auth?: { 
        userId?: string | null;
        sessionId?: string;
        sessionClaims?: Record<string, any>;
    } 
}