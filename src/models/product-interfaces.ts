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
  [color: string]: string[];
}

export interface ProductAttrs {
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

export interface ProductDoc extends mongoose.Document {
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

export interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}
