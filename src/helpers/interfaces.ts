// utils/interfaces.ts

import { Request } from "express";
import { Types } from "mongoose";

export interface Branch {}

export interface User {
    _id:Types.ObjectId,
    firstName: string;
    lastName: string;
    image: string;
    branch: Branch;
}

export interface LoginDetailWithUser {
    _id: Types.ObjectId;
    email: string;
    role: "super" | "admin" | "staff" | "patient";
    status: "active" | "deactive" | "suspended" | "deleted";
    user: User;
}

// Extend the Request interface to include `loginDetailWithUser` property
export interface ModifiedRequest extends Request {
    loginId?: Types.ObjectId | null;  // `user` can be null, so we handle that safely
}

export interface ApiErrorResponse {
    message: string | null;
    data: object | null;
    status: number;
    error: boolean | false;
    stack: string | null;
}

export interface payload {
    id: string;
}
