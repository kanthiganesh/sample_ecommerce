


import {Router} from 'express';
import { errorHandler } from "../../error-handler.js";
import { authMiddleware } from '../middlewares/auth';
import { cancelOrder, changeStatus, createOrder, getOrdreById, listAllOrders, listOrders, listUserOrders } from '../controllers/orders.js';
import { adminMiddleware } from '../middlewares/admin.js';

const orderRouter = Router();

orderRouter.post('/', [authMiddleware], errorHandler(createOrder));
orderRouter.get('/',[authMiddleware], errorHandler(listOrders))
orderRouter.put('/:id',[authMiddleware], errorHandler(cancelOrder))
orderRouter.get('/all',[authMiddleware,adminMiddleware], errorHandler(listAllOrders))
orderRouter.put('/status/:id',[authMiddleware,adminMiddleware], errorHandler(changeStatus))
orderRouter.get('/user/:id',[authMiddleware,adminMiddleware], errorHandler(listUserOrders))
orderRouter.get('/:id',[authMiddleware], errorHandler(getOrdreById))




export default orderRouter;