


import {Router} from 'express';
import { errorHandler } from "../../error-handler.js";
import { authMiddleware } from '../middlewares/auth';
import { addItemToCart, deleteItemFromCart, getCartItems, updateQuantity } from '../controllers/cart';

const cartRouter = Router();

cartRouter.post('/', [authMiddleware], errorHandler(addItemToCart));
cartRouter.delete('/:id',[authMiddleware],errorHandler(deleteItemFromCart))
cartRouter.put("/:id",[authMiddleware],errorHandler(updateQuantity))
cartRouter.get("/",[authMiddleware],errorHandler(getCartItems))


export default cartRouter;