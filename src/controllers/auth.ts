import { type NextFunction, type Request, type Response } from "express";
import { prismaClient } from "../../prisma/client.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../secrets.js";
import { BadRequestError } from "../exceptions/bad-requests.js";
import { ErrorCode } from "../exceptions/root.js";
import { userSchema } from "../schemas/users.js";
import { NotFoundException } from "../exceptions/not-found.js";
import {User} from "@prisma/client"

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  userSchema.parse(req.body);
  const { name, email, password }: { name: string; email: string; password: string } = req.body;

  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (user) {
    throw new BadRequestError("User already exists", ErrorCode.USER_ALREADY_EXISTS);
  }

  const newUser = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
    },
  });

  res.send(newUser);
};


export const login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestError("Invalid password", ErrorCode.INCORRECT_PASSWORD);
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.send({ user, token });
};

export const me = async (req: Request, res: Response) => {
  // const user = (req as Request & { user?: unknown }).user;
  const user = await prismaClient.user.findUnique({
    where :{
      id: req.user?.id
    },
    select :{
      name:true,
      addresses:{
         select:{
          city:true
         }
      }
    }
  })
  res.send(user);
};