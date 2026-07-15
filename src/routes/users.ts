
import {Router} from 'express';
import { errorHandler } from "../../error-handler.js";
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';
import { addAddress, listAddress, deleteAddress , updateUser, listUsers, getUserById, updateUserRole} from '../controllers/users.js';

const usersRouter = Router();

usersRouter.post('/', [authMiddleware], errorHandler(addAddress));
usersRouter.delete('/:id', [authMiddleware], errorHandler(deleteAddress));
usersRouter.get('/', [authMiddleware], errorHandler(listAddress));
usersRouter.put('/',[authMiddleware],errorHandler(updateUser))
usersRouter.get('/users',[authMiddleware,adminMiddleware],errorHandler(listUsers))
usersRouter.get("/users/:id",[authMiddleware,adminMiddleware],errorHandler(getUserById))
usersRouter.put("/users/:id/role",[authMiddleware,adminMiddleware],errorHandler(updateUserRole))



export default usersRouter;