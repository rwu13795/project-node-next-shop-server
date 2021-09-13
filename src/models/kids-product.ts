import mongoose from "mongoose";

import { ProductAttrs, ProductDoc, ProductModel } from "./product-interfaces";

const kidsProductSchema = new mongoose.Schema(
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
kidsProductSchema.set("versionKey", "version");

kidsProductSchema.statics.build = (attrs: ProductAttrs) => {
  return new KidsProduct(attrs);
};

const KidsProduct = mongoose.model<ProductDoc, ProductModel>(
  "kids_product",
  kidsProductSchema
);

export { KidsProduct };
