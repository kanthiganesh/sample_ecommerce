import { type NextFunction, type Request, type Response } from "express";
import { ErrorCode, HttpException } from "./src/exceptions/root.js";
import { InternalException } from "./src/exceptions/internal-exception.js";
import { UnprocessableEntityError } from "./src/exceptions/validation.js";
import { ZodError } from "zod";

export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

export const errorHandler = (method: AsyncHandler) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await method(req, res, next);
    } catch (err) {
      let exception: HttpException;

      if (err instanceof HttpException) {
        exception = err;
      } else {
        if(err instanceof ZodError){
          exception = new UnprocessableEntityError("Unprocessable Entity", ErrorCode.UNPROCESSABLE_ENTITY, err);
        } else {
          exception = new InternalException("Something went wrong", err, ErrorCode.INTERNAL_SERVER_ERROR);
        }
      }

      next(exception);
    }
  };
};