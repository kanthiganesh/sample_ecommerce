import dotenv from "dotenv";
import { z } from "zod";
dotenv.config({path: "./.env"});


const env = z.object({
  JWT_SECRET: z.string().min(1),
  PORT: z.string().min(4),
});

const ENV = env.parse(process.env);
export const PORT = ENV.PORT;
export const JWT_SECRET = ENV.JWT_SECRET;
