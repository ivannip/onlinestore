import { RequestHandler, Request, Response, NextFunction } from "express";
import { INewOrder } from "../models/order.model";
import {orderService} from "../services/order.service"

// Function to create a new order
const newOrder: RequestHandler<never, any, INewOrder> = async (req: Request, res: Response) => {
    
    try {
        const order = await orderService.createOrder(req.body);
        res.status(200).json({message: "New order created", order: order});
    } catch (err) {
        res.status(500).json({message: err});
    }  
}

// Function to update the status of an existing order
const updateOrderStatus: RequestHandler<{status: string}, any, {id: number}> = async (req: Request, res: Response) => {
    try {
        const order = await orderService.updateOrderStatusById(req.body.id, req.params.status)
        res.status(200).json({message: "order amended!", order: order});
    } catch (err) {
        res.status(500).json({message: err});
    }
}

// Function to retrieve all orders
const showAllOrder: RequestHandler = async (req: Request, res:Response) => {
    try {
        const orders = await orderService.readAllOrder();
        res.status(200).json({message: "order found!", orders: orders});
    } catch (err) {
        res.status(500).json({message: err});
    }
}

//function to show order with status = confirm
const showConfirmedOrder: RequestHandler<{month: string, year: string}> = async (req: Request, res: Response) => {
    try {
        const {month, year} = req.params
        const orders = await orderService.readConfirmedOrder(parseInt(month), parseInt(year));
        res.status(200).json({message: "order found!", orders: orders})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

//function to delete all order record
const clearAllOrder: RequestHandler = async (req: Request, res: Response) => {
    try {
        await orderService.deleteAllOrder();
        res.status(200).json({message: "All orders are cleared"})
    } catch (err) {
        res.status(500).json({message:err})
    }
}

export const orderController = {
    newOrder,
    updateOrderStatus,
    showAllOrder,
    showConfirmedOrder,
    clearAllOrder
}