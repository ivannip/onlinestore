import express from 'express';
import { productController } from '../controllers/product.controller';

const router = express.Router();

router.post("/new", productController.newProduct);

router.get("/all", productController.showAllProduct);

router.get("/one/:id", productController.showProductById);

router.patch("/update", productController.updateProduct);

router.patch("/resetinventory", productController.resetInventory);

router.post("/amends", productController.updateProductInventory);

export default router;