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
};

/////////
// Men //
/////////
const menProductSchema = new mongoose.Schema(productSchemaRequirement);
menProductSchema.statics.build = (attrs: ProductAttrs) => {
  return new MenProduct(attrs);
};
const MenProduct = mongoose.model<ProductDoc, ProductModel>(
  "men_product",
  menProductSchema
);

export { MenProduct };
