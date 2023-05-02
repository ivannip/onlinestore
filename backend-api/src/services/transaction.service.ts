import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const readAllTransaction = async() => {
    try {
        return await prisma.transaction.findMany({})
    } catch (err) {
        console.log(err)
    }
}

const deleteAllTransaction = async() => {
    try {
        await prisma.transaction.deleteMany({})
    } catch (err) {
        console.log(err)
    }
}

export const transactionService = {
    readAllTransaction,
    deleteAllTransaction
}
