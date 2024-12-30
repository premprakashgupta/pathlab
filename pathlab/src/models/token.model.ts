import { Schema, model, Types } from "mongoose"; // Import ObjectId as Types.ObjectId

// Define the schema for Token
const TokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    loginDetail: {
      type: Types.ObjectId,  // Use Types.ObjectId for references
      required: true,
      ref: "LoginDetail",  // Reference the "LoginDetail" model
    },
    loginAgent: {
      type: String,
      required: true,
      enum: ["super", "admin", "staff", "patient"], // Define valid roles
      default: 'patient', // Default role is 'patient'
    },
    deviceId: {
      type: String,
      required: true,
    }
  },
  { timestamps: true } // Automatically track createdAt and updatedAt
);

// Create and export the model
const TokenModel = model("Token", TokenSchema);

export default TokenModel;
