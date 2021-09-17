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
  imagesCount: number;
  imagesUrl?: string[];
}

export interface ProductAttrs {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  stock: StockProps;
  searchTags: string[];
  description: string;
  colorPropsList: ColorProps[];
}

export interface ProductDoc extends mongoose.Document {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  stock: StockProps;
  searchTags: string[];
  description: string;
  colorPropsList: ColorProps[];
  version: number;
}

export interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

export const productSchemaRequirement = {
  title: { type: String, required: true },
  main_cat: { type: String, required: true },
  sub_cat: { type: String, required: true },
  price: { type: Number, required: true },
  stock: {
    byColor: { type: Object, required: true },
    bySize: { type: Object, required: true },
  },
  searchTags: { type: Array, required: true },
  description: { type: String, required: true },
  colorPropsList: { type: Array, required: true },
};

export const productSchemaOption = {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
};
