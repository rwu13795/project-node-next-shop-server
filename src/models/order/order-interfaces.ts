import mongoose from "mongoose";
import { CartItem } from "../../routes/auth/controllers";
import { inputNames } from "../../utils/enums/input-names";

export interface OrderAddressFields {
  [inputNames.first_name]: string;
  [inputNames.last_name]: string;
  [inputNames.address_1]: string;
  [inputNames.address_2]: string;
  [inputNames.state]: string;
  [inputNames.city]: string;
  [inputNames.zip_code]: string;
}

export interface OrderContactInfo {
  [inputNames.email]: string;
  [inputNames.phone]: string;
}

export interface OrderAttrs {
  userId: string;
  date: Date;
  items: CartItem[];
  contactInfo: OrderContactInfo;
  shippingAddress: OrderAddressFields;
  billingAddress: OrderAddressFields;
}

export interface OrderDoc extends mongoose.Document {
  userId: string;
  date: Date;
  items: CartItem[];
  contactInfo: OrderContactInfo;
  shippingAddress: OrderAddressFields;
  billingAddress: OrderAddressFields;
}

export interface OrderModel extends mongoose.Model<any> {
  build(attrs: OrderAttrs): OrderDoc;
}
