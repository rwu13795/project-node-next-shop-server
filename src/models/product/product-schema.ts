import mongoose from "mongoose";

import { ProductAttrs, ProductDoc, ProductModel } from "./product-interfaces";

const productSchemaRequirement = {
  productInfo: {
    title: { type: String, required: true },
    main_cat: { type: String, required: true },
    sub_cat: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
  },
  colorPropsList: { type: Array, required: true },
  stock: {
    byColor: { type: Object, required: true },
    bySize: { type: Object, required: true },
  },
  searchTags: { type: Array, required: true },
  createdDate: { type: Date, required: true },
  admin_id: { type: String, required: true },
  admin_username: { type: String, required: true },
  reviewId: { type: String, ref: "review" },
};

const productSchema = new mongoose.Schema(productSchemaRequirement);
productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "product",
  productSchema
);

Product.createIndexes({ createdDate: -1 });

export { Product };
