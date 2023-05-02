import {CookieOptions} from "express";
import jwt from "jsonwebtoken";


const dev = process.env.NODE_ENV !== "production";

// COOKIE_OPTIONS defines options for the HTTP cookie that stores the user token
export const COOKIE_OPTIONS:CookieOptions = {
    httpOnly: true,
    secure: !dev,
    signed: true,
    maxAge: 25920000*1000,
}

// getToken generates a new JSON Web Token (JWT) based on the given user ID
// and the secret key from the environment variables
// It also sets the token's expiration time based on the TOKEN_EXPIRE environment variable
export const getToken = (userId: {id: number | string}): string => {
    return jwt.sign(userId, process.env.SECRET, {expiresIn: eval(process.env.TOKEN_EXPIRE)})
}

// verifyToken decodes the given JWT using the secret key from the environment variables
// and returns the token's payload (i.e., user ID) if the signature is valid
export const verifyToken = (token: string):string | jwt.JwtPayload => {
    return jwt.verify(token, process.env.SECRET);
}
