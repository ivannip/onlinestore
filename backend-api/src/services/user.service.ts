import { PrismaClient } from "@prisma/client";
import {IUser, INewUser} from "../models/user.model"

const prisma = new PrismaClient();

const createUser = async (user: INewUser) => {
    try {
        console.log(user)
        return await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                mobile: user.mobile,
                address: user.address
            }
        })
    } catch (err) {
        console.log(err)
        throw err
    }

}

const findById = async (id: IUser["id"]) => {
    try {
        return prisma.user.findUnique({
            where: {
                id: id
            }
        })
    } catch (err) {
        console.log(err)
        throw err
    }
    
};

const findByEmail = async (email: IUser["email"]) => {
    try {
        return prisma.user.findUnique({
            where: {
                email:email
            }
        })
    } catch (err) {
        console.log(err)
        throw err
    }
    
    
}

export const userService = {
    createUser,
    findByEmail,
    findById
}