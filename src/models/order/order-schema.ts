import mongoose from "mongoose";
import { OrderAttrs, OrderDoc, OrderModel } from "./order-interfaces";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  contactInfo: { type: Object, required: true },
  shippingAddress: { type: Object, required: true },
  billingAddress: { type: Object, required: true },
  paymentDetail: { type: Object, required: true },
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("order", orderSchema);

export { Order };
