import express from 'express';
import { orderController } from '../controllers/order.controller';

const router = express.Router();

router.get("/all", orderController.showAllOrder);

router.post("/new", orderController.newOrder);

router.get("/confirm/:month/:year", orderController.showConfirmedOrder);

router.post("/status/:status", orderController.updateOrderStatus);

router.delete("/deleteall", orderController.clearAllOrder);

export default router