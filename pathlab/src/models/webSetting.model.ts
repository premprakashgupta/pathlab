import { Schema, model, Types } from "mongoose"; // Import ObjectId as Types.ObjectId

// Define the schema for Token
const WebSettingSchema = new Schema(
  {
    multiDeviceLogin: {
      type: Boolean,
      required: true,
    },
    loginDetail: {
      type: Types.ObjectId,  // Use Types.ObjectId for references
      required: true,
      ref: "LoginDetail",  // Reference the "LoginDetail" model
    },
  },
  { timestamps: true } // Automatically track createdAt and updatedAt
);

// Create and export the model
const TokenModel = model("webSetting", WebSettingSchema);

export default TokenModel;
