
import { type NextFunction, type Request, type Response } from "express";
import { prismaClient } from "../../prisma/client.js";
import { ErrorCode } from "../exceptions/root.js";
import { NotFoundException } from "../exceptions/not-found.js";

export const createProduct = async (req: Request, res: Response, _next: NextFunction)=> {
    const { tags } = req.body;

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: tags.join(','),
        }
    });
    res.send(product);
};

export const updateProduct = async (req: Request, res: Response, _next: NextFunction) => {
    try{
        const product = req.body;
        if(product.tags){
            product.tags = product.tags.join(',');
        }
        const updateProduct = await prismaClient.product.update({
            where:{
                id: Number(req.params.id),
            },
            data: product,
        });
        res.send(updateProduct);
    }
    catch(error){
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    }
};
    

export const deleteProduct = async (req: Request, res: Response, _next: NextFunction) => {
    try{
        const deleteProduct = await prismaClient.product.delete({
            where:{
                id: Number(req.params.id),
            },
        });
        res.send(deleteProduct);
    }
    catch(error){
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    }
};

export const listProducts = async (req: Request, res: Response, _next: NextFunction) => {
    const count = await prismaClient.product.count();
    const products = await prismaClient.product.findMany({
        skip: Number(req.query.skip) || 0,
        take: Number(req.query.take) || 10,
    });
    res.send({ products, count });
};

export const getProduct = async (req: Request, res: Response, _next: NextFunction) => {
    try {
        const product = await prismaClient.product.findUniqueOrThrow({
            where:{
                id: Number(req.params.id),
            },
        });
        res.send(product);
    }
    catch(error){
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND);
    }
};


export const searchProduct =  async (req: Request, res: Response, _next: NextFunction) => {
    const products = await prismaClient.product.findMany({
        where:{
            name:{
                search:req.query.q?.toString()
            },
            description:{
                search:req.query.q?.toString()
            },
            tags:{
                search:req.query.q?.toString()
            }
        }
    })
    res.send(products)
}