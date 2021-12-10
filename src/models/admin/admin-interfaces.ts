import mongoose from "mongoose";

export interface ProductCatAdmin {
  [main_cat: string]: { [sub_cat: string]: number };
}

export interface AdminAttrs {
  admin_username: string;
  password: string;
  product_ids: string[];
  product_category: ProductCatAdmin;
}

export interface AdminDoc extends mongoose.Document {
  admin_username: string;
  password: string;
  product_ids: string[];
  product_category: ProductCatAdmin;
  // product_category_master?: ProductCatAdmin;
  master_admin?: boolean;
}

export interface AdminModel extends mongoose.Model<any> {
  build(attrs: AdminAttrs): AdminDoc;
}
