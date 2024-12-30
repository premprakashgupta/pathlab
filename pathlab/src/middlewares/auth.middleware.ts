import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import LoginDetailModel from "../models/loginDetail.model";
import {  ModifiedRequest } from "../helpers/interfaces";
import { Types } from "mongoose";

// Define the type for the decoded JWT payload
interface DecodedToken {
    id: Types.ObjectId;  // Assuming 'id' is the key for the user ID in the payload
}

export const authMiddleware = async (req: ModifiedRequest, res: Response, next: NextFunction):Promise<void> => {
    const token = req.cookies.token;  // Get the token from the cookies (assuming it's stored as "token")

    if (!token) {
         res.status(401).json({ message: "No token, authorization denied" });
         return;
    }

    try {
        // Verify the token and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SEC as string) as DecodedToken;

        // Attach the user object to the request for use in later middleware or route handlers
        req.loginId = decoded.id;

        // Proceed to the next middleware
        next();
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            // Handle the specific JWT errors (invalid token, expired token, etc.)
             res.status(403).json({ message: "Token is not valid" });
             return;
        }
        // General error handler (e.g., network/database issues)
         res.status(500).json({ message: "Internal server error" });
         return;
    }
};
