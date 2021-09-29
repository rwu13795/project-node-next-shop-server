import mongoose from "mongoose";
import { inputNames } from "../../utils/enums/input-names";

export interface UserAddressFields {
  [inputNames.address_1]: string;
  [inputNames.address_2]: string;
  [inputNames.state]: string;
  [inputNames.city]: string;
  [inputNames.zip_code]: string;
}

export interface UserAttrs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  orders: string[];
  shippingAddress: UserAddressFields[];
}

export interface UserDoc extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  orders: string[];
  shippingAddress: UserAddressFields[];
  resetToken?: string;
  resetTokenExpiration?: Date;
}

export interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): UserDoc;
}
