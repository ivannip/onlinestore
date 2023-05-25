import { PrismaClient } from "@prisma/client";
import { INewProduct} from "../models/product.model";
import { INewTransaction } from "../models/transaction.model";
import {IProduct} from "../models/product.model";
import {initData} from "../util/initData";
import {HandleOrderProcess} from "../util/HandleOrderProcess"
 
const prisma = new PrismaClient();

const createProduct = async (input: INewProduct) => {
  try {
    return await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        inventory: input.inventory,
        image: input.image,
        unitOfPackage: input.unitOfPackage,
      },
    });
  } catch (err) {
    console.log(err)
    throw err
  }
};

const readAllProduct = async () => {
    try {
        return await prisma.product.findMany();
    } catch (err) {
        console.log(err)
        throw err
    }
}

const readProductById = async (id: IProduct["id"]) => {
    try {
        return await prisma.product.findUnique({
            where: {
                id:id
            }
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

const updateProduct = async (product: IProduct) => {
    try {
        return await prisma.product.update({
            data:{
                name:product.name,
                inventory:product.inventory,
                price:product.price,
                description:product.description,
                unitOfPackage:product.unitOfPackage
            },
            where: {
                id: product.id
            }
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

const updateProductsForPurchasedNo = async (purchasedItems: INewTransaction []) => {
    try {
        const products = [];
        for (const item of purchasedItems) {
            const product: IProduct = await prisma.product.update({
                data:{
                    inventory: {decrement: item.quantity}
                },
                where: {
                    id: item.productId
                }
            })
            console.log(product)
            products.push(product)
        }
        return products
    } catch (err) {
        console.log(err)
        throw err
    }
}

const updateMultiProductInventory = async (purchasedItems: INewTransaction []) => {
    
    return await new HandleOrderProcess(prisma).updateInventoryByOrder(purchasedItems)
    // let updatedProducts: IProduct[] = [];
    // let product: IProduct = null
    // return await prisma.$transaction( async (tx: PrismaClient) => {
        
    //         for (var item of purchasedItems) {
    //                 product = await tx.product.update({
    //                 data: {
    //                     inventory: {decrement: item.quantity}
    //                 },
    //                 where: {
    //                     id: item.productId
    //                 }
    //             })
    //             if (product.inventory < 0)
    //                 throw new Error("Not enough inventry for the order")
    //             else
    //                 updatedProducts.push(product)
    //         }
    //         return updatedProducts     
    // })
}



const initProduct = async () => {
    try {
        const products = initData.products;
        await prisma.product.deleteMany({})
        await prisma.product.createMany({
            data: products    
        })
    } catch (err) {
        console.log(err)
        throw err
    }
    
}

export const productService = {
  createProduct,
  readAllProduct,
  readProductById,
  updateProduct,
  updateProductsForPurchasedNo,
  updateMultiProductInventory,
  initProduct
};
