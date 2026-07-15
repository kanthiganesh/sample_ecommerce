import { Router } from "express";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import usersRouter from "./users.js";
import cartRouter from "./cart.js";
import orderRouter from "./orders.js";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/products", productsRouter);
rootRouter.use("/address", usersRouter);
rootRouter.use("/cart",cartRouter)
rootRouter.use("/order",orderRouter)
export default rootRouter