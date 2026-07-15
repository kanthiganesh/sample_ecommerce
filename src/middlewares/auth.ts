import { UnAuthorizedException } from "../exceptions/unauthorize.js";
import { ErrorCode } from "../exceptions/root.js";
import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets.js";
import { prismaClient } from "../../prisma/client.js";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (typeof authHeader !== "string") {
    return next(new UnAuthorizedException("Authorization header is missing", ErrorCode.UNAUTHORIZED));
  }

  try {
    console.log("authHeader:", authHeader,JWT_SECRET); // Log
    const payload = jwt.verify(authHeader, JWT_SECRET) as { id: number };
    console.log("payload:", payload); // Log
    if (!payload) {
      return next(new UnAuthorizedException("Invalid token", ErrorCode.UNAUTHORIZED));
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      return next(new UnAuthorizedException("User not found", ErrorCode.UNAUTHORIZED));
    }

    (req as Request & { user?: unknown }).user = user;
    return next();
  } catch (err) {
    console.error("Error in authMiddleware:", err); // Log the error
    return next(new UnAuthorizedException("Invalid token", ErrorCode.UNAUTHORIZED));
  }
};