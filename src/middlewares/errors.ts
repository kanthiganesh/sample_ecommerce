import { type NextFunction, type Response } from "express";
import HttpException from "../exceptions/root.js";

export const errorMiddleware = (
  err: unknown,
  _req: unknown,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof HttpException) {
    res.status(err.statusCode).json({
      message: err.message,
      errorCode: err.errorCode,
      errors: err.errors,
    });
    return;
  }

  res.status(500).json({
    message: "Something went wrong",
    errorCode: 1005,
    errors: null,
  });
};