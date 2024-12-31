import { model, Schema, Types } from "mongoose";

const branchSchema = new Schema({
    name: { type: String, required: true },
    organization: { type: Types.ObjectId, ref: "Organization" }, // Link to Organization
    address: { type: String },
  },{timestamps:true});
  
  export const BranchModel = model("Branch", branchSchema);
  