import mongoose from "mongoose";

import {
  ProductAttrs,
  ProductDoc,
  ProductModel,
  productSchemaOption,
  productSchemaRequirement,
} from "./product-interfaces";

// Kids //
const kidsProductSchema = new mongoose.Schema(
  productSchemaRequirement,
  productSchemaOption
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

// Men //
const menProductSchema = new mongoose.Schema(
  productSchemaRequirement,
  productSchemaOption
);
menProductSchema.set("versionKey", "version");
menProductSchema.statics.build = (attrs: ProductAttrs) => {
  return new MenProduct(attrs);
};
const MenProduct = mongoose.model<ProductDoc, ProductModel>(
  "men_product",
  menProductSchema
);

// Women //
const womenProductSchema = new mongoose.Schema(
  productSchemaRequirement,
  productSchemaOption
);
womenProductSchema.set("versionKey", "version");
womenProductSchema.statics.build = (attrs: ProductAttrs) => {
  return new WomenProduct(attrs);
};
const WomenProduct = mongoose.model<ProductDoc, ProductModel>(
  "women_product",
  womenProductSchema
);

export { KidsProduct, MenProduct, WomenProduct };
