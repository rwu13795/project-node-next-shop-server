import mongoose from "mongoose";

export interface AdminAttrs {
  admin_id: string;
  password: string;
  added_productIds: string[];
}

export interface AdminDoc extends mongoose.Document {
  admin_id: string;
  password: string;
  added_productIds: string[];
}

export interface AdminModel extends mongoose.Model<any> {
  build(attrs: AdminAttrs): AdminDoc;
}
