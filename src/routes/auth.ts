import { Router } from "express";
import { login, me, signup } from "../controllers/auth.js";
import { errorHandler } from "../../error-handler.js";
import { authMiddleware } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/signup", errorHandler(signup));
authRouter.post("/login", errorHandler(login));
authRouter.get("/me", [authMiddleware], errorHandler(me));

export default authRouter