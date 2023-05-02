import {Request, Response, RequestHandler, NextFunction} from "express";
import jwt from "jsonwebtoken";

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    
    const { signedCookies = {}} = req;
    const {token} = signedCookies;
    if (!token) return res.status(401).json({auth: false, message: "No token provided"});
    jwt.verify(token, process.env.SECRET, (err: Error, decoded: any) => {
        if (err) return res.status(500).json({auth: false, message: "Fail to authenticate token"})
        req.body.id = decoded.id;
        next();      
    })
}