import { type Request, type Response, type NextFunction } from "express";
import { prismaClient } from "../../prisma/client.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { UnAuthorizedException } from "../exceptions/unauthorize.js";
import { CreateCartShema, updateCartSchema } from "../schemas/cart";
import { ErrorCode } from "../exceptions/root";
import { CartItem, Product } from "@prisma/client";

export const addItemToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validatedData = CreateCartShema.parse(req.body);
    let product:Product;
    try{
        product = await prismaClient.product.findUniqueOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    }
    catch(err){
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }

    const userId = req.user?.id;
    if (!userId) {
        throw new UnAuthorizedException("User not authenticated", ErrorCode.UNAUTHORIZED);
    }
    let cart:CartItem | null;
    cart = await prismaClient.cartItem.findFirst({
        where:{
            productId: product.id,
            userId:userId
        }
    });
    if(!cart){
        cart = await prismaClient.cartItem.create({
            data: {
                ...validatedData,
                userId,
            },
        });
    }else{
        cart = await prismaClient.cartItem.update({
            where:{
                id:cart.id
            },
            data: {
                quantity: validatedData.quantity+cart.quantity
            },
        });
    }
    

    res.send(cart);
};


export const deleteItemFromCart = async (req:Request,res:Response,next:NextFunction) =>{
    await prismaClient.cartItem.delete({
        where:{
            id: Number(req.params.id)
        }
    })
    res.json({status:"success"})
}

export const updateQuantity = async (req:Request,res:Response,next:NextFunction) =>{
    const validatedData = updateCartSchema.parse(req.body)
    const cart = await prismaClient.cartItem.update({
        where:{
            id: Number(req.params.id)
        },
        data:{
            quantity:validatedData.quantity
        }
    })
    res.send(cart)
}

export const getCartItems =  async (req:Request,res:Response,next:NextFunction) =>{
    const cartItems = await prismaClient.cartItem.findUnique({
        where:{
            id: Number(req.user?.id)
        },
        include:{
            product :true
        }
    })
    res.send(cartItems)
}