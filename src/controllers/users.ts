import { type NextFunction, type Request, type Response } from "express";
import {UpdateUserSchema,addressSchema} from "../schemas/users.js";
import {prismaClient} from "../../prisma/client.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCode } from "../exceptions/root.js";
import { Address } from "@prisma/client";
import { BadRequestError } from "../exceptions/bad-requests.js";

export const addAddress = async (req: Request, res: Response, next: NextFunction) => {
    addressSchema.parse(req.body);

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: req.user?.id,
        }
    });
    res.send(address)
}

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try{
         const { id } = req.params;

        const address = await prismaClient.address.delete({
            where: {
                id: Number(id),
                userId: req.user?.id,
            }
        });
        res.send(address)
    }catch(error){
        throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND);
    }
   
}

export const listAddress = async (req: Request, res: Response, next: NextFunction) => {
    const addresses = await prismaClient.address.findMany({
        skip: Number(req.query.skip) || 0,
        take: Number(req.query.take) || 10,
        where: {
            userId: req.user?.id,
        }
    });
    res.send(addresses)
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = UpdateUserSchema.parse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;
    if(validatedData.defaultShippingAddress){
        try{
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            });

            if(shippingAddress.userId !== req.user?.id){
                throw new BadRequestError("Shipping address not belongs to the user", ErrorCode.ADDRESS_DOES_NOT_BELONGS);
            }
        }
        catch(error){
            throw new NotFoundException("Shipping address not found", ErrorCode.ADDRESS_NOT_FOUND);
        }


    }
    if(validatedData.defaultBillingAddress){
        try{
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            });

            if(billingAddress.userId !== req.user?.id){
                throw new BadRequestError("Billings address not belongs to the user", ErrorCode.ADDRESS_DOES_NOT_BELONGS);
            }
        }
        catch(error){
            throw new NotFoundException("Billing address not found", ErrorCode.ADDRESS_NOT_FOUND);
        }
    }

    const updatedUser = await prismaClient.user.update({
        where:{
            id: req.user?.id
        },
        data:validatedData
    })
    res.json(updatedUser)

    
}


export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await prismaClient.user.findMany({
        skip :Number(req.query.skip) || 0,
        take: 10
    })
    res.send(users)
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const users = await prismaClient.user.findUniqueOrThrow({
        where :{
            id: Number(req.params.id)
        },
        include:{
            addresses:true
        }
    })
    res.send(users)
    }
    catch(err){
        throw new NotFoundException("User not found",ErrorCode.USER_NOT_FOUND)
    }
}

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
    const user =await  prismaClient.user.update({
        where:{
            id: Number(req.params.id)
        },
        data:{
            role:req.body.role
        }
    })
    res.send(user)
}

