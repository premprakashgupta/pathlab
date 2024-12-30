import { Schema, Types, model } from "mongoose";

// Define the schema for LoginDetail
const LoginDetailSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true, 
    },
    password: {
      type: String,
      required: true,
      select:false 
    },
    role: {
      type: String,
      required: true, 
      enum: ["super", "admin", "staff", "patient"], // Use the 'enum' option for roles
      default:'patient'
    },
    status:{
      type: String,
      required: true, 
      enum: ["active", "deactive", "suspended", "deleted"], // Use the 'enum' option for roles
      default:'deactive'
    },
    user:{
      type:Types.ObjectId,
      ref:'User',
    }
  },
  { timestamps: true }
);

// Create and export the model
const LoginDetailModel = model("LoginDetail", LoginDetailSchema);

export default LoginDetailModel;
