import { NextFunction, Request, Response } from "express";

import {
  KidsProduct,
  WomenProduct,
  MenProduct,
} from "../../../models/product/product-schema";

import {
  ColorProps,
  ProductAttrs,
} from "../../../models/product/product-interfaces";
import {
  MainCategory,
  sizesArray,
} from "../../../models/product/product-enums";
import mapStock from "../helpers/map-product-stock";
import uploadImageTo_S3 from "../helpers/upload-to-S3";

export interface ColorPropsFromClient {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imageCount: number;
  imageFiles: string[];
  modifiedImages?: (string | File)[];
  modifiedIndex?: number[];
}
interface AddProductBody {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  colorPropsListFromClient: ColorPropsFromClient[];
  description: string;
}

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageFiles = req.files;
  const {
    title,
    main_cat,
    sub_cat,
    price,
    colorPropsListFromClient,
    description,
  }: AddProductBody = req.body;

  // put keywords in search tags
  const tagsRegex = /[\s-]+/g; // match all "space" and "dash-line"
  let searchTags: string[] = [...title.split(tagsRegex)];
  for (let e of colorPropsListFromClient) {
    searchTags.push(e.colorName);
  }

  const stock = mapStock(sizesArray, colorPropsListFromClient);

  const colorPropsList_toBeSaved: ColorProps[] = await uploadImageTo_S3(
    false,
    imageFiles,
    colorPropsListFromClient,
    main_cat.toLocaleLowerCase(),
    sub_cat.toLocaleLowerCase(),
    title
  );

  const productAttrs: ProductAttrs = {
    productInfo: {
      title,
      main_cat: main_cat.toLocaleLowerCase(),
      sub_cat: sub_cat.toLocaleLowerCase(),
      price,
      description,
    },
    colorPropsList: colorPropsList_toBeSaved,
    stock,
    searchTags,
  };

  let product;
  switch (main_cat.toLocaleLowerCase()) {
    case MainCategory.men: {
      product = MenProduct.build(productAttrs);
      break;
    }
    case MainCategory.women: {
      product = WomenProduct.build(productAttrs);
      break;
    }
    case MainCategory.kids: {
      product = KidsProduct.build(productAttrs);
      break;
    }
    default: {
      break;
    }
  }

  await product.save();

  console.log("> > > new product added < < <");
  res.status(201).send({ message: "OK" });
};
