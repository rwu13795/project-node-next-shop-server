import { NextFunction, Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";

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
import { UploadedImages } from "../../../middlewares";

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
  admin_id: string;
}

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const imageFiles: UploadedImages = req.files;
  const {
    title,
    main_cat,
    sub_cat,
    price,
    colorPropsListFromClient,
    description,
    admin_id,
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
    createdDate: new Date(),
    admin_id,
  };

  let product = Product.build(productAttrs);

  await product.save();

  console.log("> > > new product added < < <");
  res.status(201).send({ message: "OK" });
};
