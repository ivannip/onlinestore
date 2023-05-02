import { RequestHandler, Request, Response } from "express";
import {INewProduct, IProduct} from "../models/product.model"
import { productService } from "../services/product.service"
import { transactionService } from "../services/transaction.service";
import {INewTransaction} from "../models/transaction.model"

const showProductById: RequestHandler<{id: string}> = async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.id)
        // find by Id
        const product = await productService.readProductById(productId);
        res.status(200).json({message: "Product found!", product: product})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

const newProduct: RequestHandler<{}, {}, INewProduct> = async (req: Request, res: Response) => {
    try {
        const {name, description, price, inventory, image, unitOfPackage} = req.body;
        console.log({name, description, price, inventory, image, unitOfPackage})
        //create product
        const product = await productService.createProduct({name, description, price, inventory, image, unitOfPackage});
        res.status(200).json({message: "Product created", product: product})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

const showAllProduct: RequestHandler = async (req: Request, res: Response) => {
    try {
        const products = await productService.readAllProduct();
        res.status(200).json({message: "Products found!", products: products})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

const updateProduct: RequestHandler<{}, {}, IProduct> = async (req: Request, res: Response) => {
    try {
        const {id, name, description, price, inventory, image, unitOfPackage} = req.body;
        const product = await productService.updateProduct({id, name, description, price, inventory, image, unitOfPackage});
        res.status(200).json({message: "Product updated!", product: product})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

const updateProductInventory: RequestHandler<{}, {}, {purchasedItems: INewTransaction []}> = async (req: Request, res: Response) => {
    try {
        const purchasedItems = req.body.purchasedItems;
        const products = await productService.updateProductsForPurchasedNo(purchasedItems);
        res.status(200).json({message: "Products updated!", products: products})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

const resetInventory: RequestHandler = async (req: Request, res: Response) => {
    try {
        await transactionService.deleteAllTransaction();
        await productService.initProduct();
        res.status(200).json({message: "inventory reset"})
    } catch (err) {
        res.status(500).json({message: err})
    }
}

export const productController = {
    newProduct,
    showAllProduct,
    showProductById,
    updateProduct,
    updateProductInventory,
    resetInventory
}

