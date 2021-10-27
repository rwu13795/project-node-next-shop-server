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
  createdDate: Date;
  admin_username: string;
  reviewId?: string;
}

export interface ProductDoc extends mongoose.Document {
  productInfo: ProductInfo;
  colorPropsList: ColorProps[];
  stock: StockProps;
  searchTags: string[];
  createdDate: Date;
  admin_username: string;
  reviewId: string;
}

export interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}
