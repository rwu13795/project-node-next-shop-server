import mongoose from "mongoose";

export interface StockProps {
  byColor: {
    [color: string]: { [size: string]: number; total: number };
  };

  bySize: {
    [size: string]: { [color: string]: number; total: number };
  };
}

export interface ColorPair {
  [colorName: string]: string; // { ["colorName"] : "colorCode" }
}

export interface ImagesUrlProps {
  [color: string]: {
    main: string | undefined;
    sub: string[] | undefined;
  };
}

interface ProductAttrs {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  colors: ColorPair[];
  sizes: string[];
  stock: StockProps;
  searchTags: string[];
  imagesUrl: ImagesUrlProps;
  description: string;
}

interface ProductDoc extends mongoose.Document {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  colors: string[];
  sizes: string[];
  stock: StockProps;
  searchTags: string[];
  imagesUrl: ImagesUrlProps;
  description: string;
  version: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
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
productSchema.set("versionKey", "version");

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };