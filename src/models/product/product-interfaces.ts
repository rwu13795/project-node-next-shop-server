import mongoose from "mongoose";

export interface StockProps {
  byColor: {
    [color: string]: { [size: string]: number; total: number };
  };

  bySize: {
    [size: string]: { [color: string]: number; total: number };
  };
}

export interface ColorProps {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imageCount: number;
  imageFiles: string[];
}

export interface ProductInfo {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  description: string;
}

export interface ProductAttrs {
  productInfo: ProductInfo;
  colorPropsList: ColorProps[];
  stock: StockProps;
  searchTags: string[];
}

export interface ProductDoc extends mongoose.Document {
  productInfo: ProductInfo;
  colorPropsList: ColorProps[];
  stock: StockProps;
  searchTags: string[];
  version: number;
}

export interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

export const productSchemaRequirement = {
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

export const productSchemaOption = {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
};
