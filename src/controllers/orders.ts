import { Request, Response } from "express"
import { prismaClient } from "../../prisma/client"
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCode } from "../exceptions/root"

export const createOrder = async(req: Request, res: Response)=>{
    // 1. create a transaction
    // 2. to list all the cart items and proceed if cart is not empty
    // 3. calculate the totla amount
    // 4. fetch address of user
    // 5. to define computed field for formatted address on address module
    // 6 we will crete a order and order productsorder productions
    // 7. create event
    // 8 clear cart items after ordre is created
    return await prismaClient.$transaction(async(txt)=>{
        const cartItems = await txt.cartItem.findMany({
            where:{
                userId: req.user?.id
            },
            include:{
                product :true
            }
        })

        if(cartItems.length==0){
            return res.json({message:"cart is empty"})
        }
        const price = cartItems.reduce((acc,curr)=>{
            return acc + (curr.quantity * Number(curr.product.price))
        },0)

        const address = await txt.address.findFirst({
            where:{
                id: Number(req.user?.defaultShippingAddress)
            }
        })

        const order =await txt.order.create({
            data: {
                userId: Number(req.user?.id),
                netAmount:price,
                address: String(address?.formattedAdress),
                products:{
                    create: cartItems.map((cart)=>{
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        })

        const orderEvent = await txt.orderEvent.create({
            data:{
                orderId: order.id
            }
        })

        await txt.cartItem.deleteMany({
            where: {
                userId:req.user?.id
            }
        })
        return res.json(order)
    })   
    
}


export const listOrders = async (req: Request, res:Response)=>{
    const orders = await prismaClient.order.findMany({
        where:{
            id: req.user?.id
        }
    })
    res.send(orders)
}

export const getOrdreById = async (req: Request, res:Response)=>{
    const orders = await prismaClient.order.findMany({
        where:{
            id: Number(req.params.id)
        },
        include:{
            products: {
                include:{
                    product:true
                } 
            },
            events:true,
        }
    })
    res.send(orders)
}

export const cancelOrder = async (req: Request, res:Response)=>{
    try{
    await prismaClient.$transaction(async (tx)=>{
        
            const order = await tx.order.update({
                where: {
                    id: Number(req.params.id),
                    userId: req.user?.id
                },
                data:{
                    status:"CANCELLED"
                        }
                })
            await tx.orderEvent.create({
                data:{
                    orderId:Number(req.params.id),
                    status:"CANCELLED"
                }
            })
            res.send(order)
       
    })
     }
    catch(err){
        console.log("erntered",err)
        throw new NotFoundException("Order not found",ErrorCode.ORDER_NOT_FOUND)
    }  
}




export const listAllOrders = async (req: Request, res:Response)=>{
    const status = req.query.status;
    let whereClause = {}
    if(status)
        whereClause={status:status}
    const orders = await prismaClient.order.findMany({
        where:whereClause,
        skip:Number(req.query.skip) || 0,
        take: 5
    })
    res.send(orders)
}

export const changeStatus = async (req: Request, res:Response)=>{
    try{
        await prismaClient.$transaction(async(tx)=>{
        const orders = await tx.order.update({
            where:{
                id: Number(req.params.id)
            },
        data:{
            status: req.body.status
        }
        })
        await tx.orderEvent.create({
            data:{
                orderId:Number(req.params.id),
                status:req.body.status
            }
        })
        res.send(orders)

    })
    }catch(err){
        throw new NotFoundException("Order not found",ErrorCode.ORDER_NOT_FOUND)
    }
    
    
}

export const listUserOrders = async (req: Request, res:Response)=>{
    const status = req.query.status;
    let whereClause = {userId : Number(req.params.id)}
    if(status)
        whereClause={...whereClause,status:status} as {userId:number,status:string}
    const orders = await prismaClient.order.findMany({
        where:whereClause,
        take:5,
        skip: Number(req.query.skip) || 0
    })
    res.send(orders)
}