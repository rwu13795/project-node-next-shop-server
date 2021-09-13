import mongoose from "mongoose";

import { ProductAttrs, ProductDoc, ProductModel } from "./product-interfaces";

const womenProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    main_cat: { type: String, required: true },
    sub_cat: { type: String, required: true },
    price: { type: Number, required: true },
    colors: { type: Array, required: true },
    sizes: { type: Array, required: true },
    stock: {
      byColor: { type: Object, required: true },
      bySize: { type: Object, required: true },
    },
    searchTags: { type: Array, required: true },
    imagesUrl: { type: Object, required: true },
    description: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// change the default "__v" version property to "version"
womenProductSchema.set("versionKey", "version");

womenProductSchema.statics.build = (attrs: ProductAttrs) => {
  return new WomenProduct(attrs);
};

const WomenProduct = mongoose.model<ProductDoc, ProductModel>(
  "women_product",
  womenProductSchema
);

export { WomenProduct };
