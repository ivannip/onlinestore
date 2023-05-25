import { PrismaClient } from "@prisma/client"
import { INewTransaction } from "../models/transaction.model";
import { IProduct } from "../models/product.model";

export class HandleOrderProcess {

    prisma: PrismaClient = null;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    updateInventoryByOrder = async (purchasedItems: INewTransaction[]) => {
        let updatedProducts: IProduct[] = [];
        let product: IProduct = null
        return await this.prisma.$transaction( async (tx: PrismaClient) => {

                for (var item of purchasedItems) {
                        product = await tx.product.update({
                        data: {
                            inventory: {decrement: item.quantity}
                        },
                        where: {
                            id: item.productId
                        }
                    })
                    if (product.inventory < 0)
                        throw new Error("Not enough inventry for the order")
                    else
                        updatedProducts.push(product)
                }
                return updatedProducts     
        })
    }
}