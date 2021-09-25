import { NextFunction, Request, Response } from "express";

import { ObjectId } from "mongodb";

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
import { ColorPropsFromClient } from "./add-product";
import mapStock from "../helpers/map-product-stock";
import uploadImageTo_S3 from "../helpers/upload-to-S3";
import deleteImages from "../helpers/delete-image-on-S3";

interface EditProductBody {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  colorPropsListFromClient: ColorPropsFromClient[];
  description: string;
  productId: string;
  deletedImgaes: string[];
}

export const editProduct = async (
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
    productId,
    deletedImgaes,
  }: EditProductBody = req.body;

  // put keywords in search tags
  const tagsRegex = /[\s-]+/g; // match all "space" and "dash-line"
  let searchTags: string[] = [...title.split(tagsRegex)];
  for (let e of colorPropsListFromClient) {
    searchTags.push(e.colorName);
  }

  const stock = mapStock(sizesArray, colorPropsListFromClient);

  const [colorPropsList_toBeSaved]: [ColorProps[], void] = await Promise.all([
    uploadImageTo_S3(
      true,
      imageFiles,
      colorPropsListFromClient,
      main_cat.toLowerCase(),
      sub_cat.toLowerCase(),
      title
    ),
    deleteImages(deletedImgaes),
  ]);

  console.log(colorPropsList_toBeSaved);

  const productUpdate: ProductAttrs = {
    productInfo: {
      title,
      main_cat: main_cat.toLowerCase(),
      sub_cat: sub_cat.toLowerCase(),
      price,
      description,
    },
    colorPropsList: colorPropsList_toBeSaved,
    stock,
    searchTags,
  };

  let product;
  switch (main_cat.toLowerCase()) {
    case MainCategory.men: {
      product = await MenProduct.findOneAndUpdate(
        { _id: new ObjectId(productId) },
        productUpdate,
        { new: true }
      );
      break;
    }
    case MainCategory.women: {
      product = await WomenProduct.findOneAndUpdate(
        { _id: new ObjectId(productId) },
        productUpdate,
        { new: true }
      );
      break;
    }
    case MainCategory.kids: {
      product = await KidsProduct.findOneAndUpdate(
        { _id: new ObjectId(productId) },
        productUpdate,
        { new: true }
      );
      break;
    }
    default: {
      break;
    }
  }

  if (!product) {
  }

  console.log("> > > product edited < < <");
  res.status(201).send({ message: "OK" });
};
