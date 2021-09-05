import mongoose from "mongoose";

interface ColorProps {
  [color: string]: { [sizeTag: string]: number };
}

interface SizeProps {
  [size: string]: { [color: string]: number };
}

interface ProductAttrs {
  title: string;
  price: number;
  colors: string[];
  sizes: string[];
  stock: { color: ColorProps; size: SizeProps };
}

interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  colors: string[];
  sizes: string[];
  stock: { color: ColorProps; size: SizeProps };
  version: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    colors: {
      type: Array,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    stock: {
      color: { type: Object, required: true },
      size: { type: Object, required: true },
    },
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
productSchema.set("versionKey", "version");

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
