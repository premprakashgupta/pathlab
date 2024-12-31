import { Schema, model, Types } from "mongoose"; // Import ObjectId as Types.ObjectId

// Define the schema for Token
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    branch: {
      type: Types.ObjectId,  // Use Types.ObjectId for references
      required: true,
      ref: "Branch",  // Reference the "LoginDetail" model
    },
  },
  { timestamps: true } // Automatically track createdAt and updatedAt
);

// Create and export the model
const UserModel = model("User", UserSchema);

export default UserModel;
