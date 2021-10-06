import mongoose from "mongoose";

export interface AdminAttrs {
  admin_id: string;
  password: string;
  product_ids: string[];
}

export interface AdminDoc extends mongoose.Document {
  admin_id: string;
  password: string;
  product_ids: string[];
}

export interface AdminModel extends mongoose.Model<any> {
  build(attrs: AdminAttrs): AdminDoc;
}
