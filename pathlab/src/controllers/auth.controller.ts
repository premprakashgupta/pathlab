// controllers/auth.controller.ts
import { Request, Response } from "express";
import tryCatchWrapper from "../utils/try.catch.utils";
import LoginDetailModel from "../models/loginDetail.model";
import ApiError from "../utils/api.error";
import TokenModel from "../models/token.model";
import { generateToken, tokenDeleteAndInsert } from "../helpers/session.operation";
import { comparePassword, hashPassword } from "../helpers/password.operatiion";
import { ModifiedRequest } from "../helpers/interfaces";

export const loginDetailControllerV1 = async (req: Request, res: Response): Promise<void> => {
  await tryCatchWrapper(async () => {
      const { email, password, loginAgent, deviceId } = req.body;

      // Check if the email exists
      const existingUser = await LoginDetailModel.findOne({ email }).select("+password");
      if (!existingUser) {
          throw new ApiError("User with this email does not exist.", 404);
      }

      // Validate password
      if (!password) {
          throw new ApiError("User has not set a password yet.", 404);
      }

      // Compare password using bcrypt
      const passwordMatch = await comparePassword(password, existingUser.password);
      if (!passwordMatch) {
          throw new ApiError("Invalid Credentials, Kindly re-try", 401);
      }

      // Generate a JWT token
      const token = generateToken({ id: existingUser.id });

      await tokenDeleteAndInsert(existingUser._id, loginAgent, token, deviceId);

      // Set the token as a cookie in the response (for client-side access)
      res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1 hour expiry

      const { password: _, ...userWithoutPassword } = existingUser.toObject();

      // Return the result after successful login
      return {data:userWithoutPassword,status:200,message:"User login successfully"};
  }, res); // Pass the `res` object to the wrapper to handle the response
};;

export const registerControllerV1 = async (req: Request, res: Response): Promise<void> => {
  await tryCatchWrapper(async () => {
      const { email, password, loginAgent, deviceId } = req.body;

      // Check if the email exists
      const existingUser = await LoginDetailModel.findOne({ email });
      if (existingUser) {
          throw new ApiError("User with this email already exists.", 400); // Changed 404 to 400 for "Bad Request"
      }

      // Validate password
      if (!password) {
          throw new ApiError("Password is required.", 400); // Changed 404 to 400 for "Bad Request"
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const user = await LoginDetailModel.create({
          email,
          password: hashedPassword,
          loginAgent,
          deviceId,
      });

      if (!user) {
          throw new ApiError("Something went wrong when creating the user.", 500); // Changed to 500 for server errors
      }

      // Omit the password from the user object for the response
      const { password: _, ...userWithoutPassword } = user.toObject();

      // Return the user object without the password
      return {data:userWithoutPassword,status:201,message:"User created successfully"};
  }, res); // Pass the `res` object to handle the response inside the wrapper
};

export const authMeV1=async(req:ModifiedRequest,res:Response): Promise<void>=>{
    await tryCatchWrapper(async()=>{
      const loginDetail=await LoginDetailModel.findById(req.loginId).populate('user');
      return {data:loginDetail,status:200,} ;

    },res)
}