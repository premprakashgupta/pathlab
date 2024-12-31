import { Schema, model, Types } from "mongoose"; // Import ObjectId as Types.ObjectId

// Define the schema for Token
const RoleSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required:true,
        default:true,
    },
    organisation: {
      type: Types.ObjectId,  // Use Types.ObjectId for references
      required: true,
      ref: "Organisation",  // Reference the "LoginDetail" model
    },
  },
  { timestamps: true } // Automatically track createdAt and updatedAt
);


export default model("Role", RoleSchema);
