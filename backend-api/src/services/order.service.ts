import {INewOrder, IOrder} from "../models/order.model"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// This function creates a new order with the provided input and returns the newly created order
// It uses the Prisma client to communicate with the database
// The input parameter is an object that contains the customer information, contact details, delivery address and purchased items
// The function creates the new order and its purchased items using the create() method of the Prisma client
// It also includes the product information of the purchased items using the include() method of the Prisma client
const createOrder = async (input: INewOrder, status="confirmed") => {
    
    try {
        const newOrder = await prisma.order.create({
            data: {
                customer: input.customer,
                contact: input.contact,
                deliveryAddress: input.deliveryAddress,
                status: status,
                purchasedItems: {
                    create: input.purchasedItems
                  }
          },
          include:{
            purchasedItems: {
                include: { product: true}
            }
          } 
        })
        
        return newOrder
    } catch (err) {
        console.log(err)
        throw err
    }
}



const readAllOrder = async () => {
    try {
        return await prisma.order.findMany({
            include:{
                purchasedItems: {
                    include: { product: true}
                }
            }
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

// This function reads all the orders that are confirmed within a certain month and year range
// It takes two arguments: month (number) and year (number)
// It returns an array of orders that match the specified criteria
// It throws an error if there is any issue in fetching the data from the database
const readConfirmedOrder = async (month: number, year: number) => {
    
    try {
        // Convert month to zero-based index
        month = month - 1;
        // Set the start date to the first day of the specified month and year
        const _date = new Date(`${year}-01-01T00:00:00`);
        const startDate = new Date(_date.setMonth(month));
        // Set the end date to the last day of the specified month and year
        const endDate = new Date(_date.setMonth(month+1));
        // Fetch orders that are confirmed and have a delivery date between the start and end date
        return await prisma.order.findMany({
            where: {
                status: "confirm",
                deliveryDate:{gte: startDate, lte: endDate}
            },
        // Include the purchased items and their associated products in the returned data
            include: {
                purchasedItems:{
                    include: {product:true}
                }
            }
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

const updateOrderStatusById = async (id: IOrder["id"], status:string) => {
    try {
        return await prisma.order.update({
            data: {status: status},
            where: {id: id}
        })
    } catch (err) {
        console.log(err)
        throw err
    }
} 

const deleteAllOrder = async () => {
    try {
        await prisma.order.deleteMany({})
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const orderService = {
    createOrder,
    readAllOrder,
    readConfirmedOrder,
    updateOrderStatusById,
    deleteAllOrder
}