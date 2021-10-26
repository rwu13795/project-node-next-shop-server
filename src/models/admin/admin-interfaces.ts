import mongoose from "mongoose";

export interface AdminAttrs {
  admin_username: string;
  password: string;
  product_ids: string[];
}

export interface AdminDoc extends mongoose.Document {
  admin_username: string;
  password: string;
  product_ids: string[];
  master_admin?: boolean;
}

export interface AdminModel extends mongoose.Model<any> {
  build(attrs: AdminAttrs): AdminDoc;
}
