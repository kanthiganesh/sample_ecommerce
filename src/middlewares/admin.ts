import { Request, Response, NextFunction } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorize.js";
import { ErrorCode } from "../exceptions/root.js";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.role === "ADMIN")
        next();
    else
        return next(new UnAuthorizedException("User is not an admin", ErrorCode.UNAUTHORIZED));
}