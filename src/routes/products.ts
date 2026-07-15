import {Router} from 'express';
import { createProduct, deleteProduct, getProduct, listProducts, searchProduct, updateProduct } from '../controllers/products';
import { errorHandler } from "../../error-handler.js";
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

const productsRouter = Router();

productsRouter.post('/', [authMiddleware,adminMiddleware], errorHandler(createProduct));
productsRouter.put('/:id', [authMiddleware,adminMiddleware], errorHandler(updateProduct));
productsRouter.delete('/:id', [authMiddleware,adminMiddleware], errorHandler(deleteProduct));
productsRouter.get('/list', [authMiddleware,adminMiddleware], errorHandler(listProducts));
productsRouter.get("/search",[authMiddleware],errorHandler(searchProduct))
productsRouter.get('/:id', [authMiddleware,adminMiddleware], errorHandler(getProduct));


export default productsRouter;