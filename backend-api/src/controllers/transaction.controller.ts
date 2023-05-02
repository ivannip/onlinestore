import { transactionService } from "../../src/services/transaction.service";
import {RequestHandler,Request, Response} from "express";

const showAllTransaction: RequestHandler = async (req: Request, res: Response) => {
    try {
        const transactions = await transactionService.readAllTransaction()
        res.status(200).json({message: "transactions found", transactions: transactions})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

const deleteAllTransaction: RequestHandler = async (req: Request, res: Response) => {
    try {
        await transactionService.deleteAllTransaction()
        res.status(200).json({message: "All Transactions deleted"})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

export const transactionController = {
    showAllTransaction,
    deleteAllTransaction
}