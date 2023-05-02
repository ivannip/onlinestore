import express from "express";
import { transactionController } from "../controllers/transaction.controller";

const router = express.Router();

router.get("/all", transactionController.showAllTransaction)

router.delete("/deleteall", transactionController.deleteAllTransaction)

export default router