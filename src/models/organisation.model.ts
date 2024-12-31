import { model, Schema } from "mongoose";

const organizationSchema = new Schema({
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    address: { type: String,required:true },
    image:{type:String,required:true}
  },{timestamps:true});
  
  export const OrganizationModel = model("Organization", organizationSchema);
  