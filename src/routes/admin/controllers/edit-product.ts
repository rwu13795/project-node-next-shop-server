import { NextFunction, Request, Response } from "express";

import { ObjectId } from "mongodb";

import { Product } from "../../../models/product/product-schema";

import {
  ColorProps,
  ProductAttrs,
} from "../../../models/product/product-interfaces";
import { sizesArray } from "../../../models/product/product-enums";
import { ColorPropsFromClient } from "./add-product";
import mapStock from "../helpers/map-product-stock";
import uploadImageTo_S3 from "../helpers/upload-to-S3";
import deleteImages from "../helpers/delete-image-on-S3";
import { UploadedImages } from "../../../middlewares";
import { updateFilterStats } from "../helpers/update-filter-stats";
import updateCategoryNumber from "../helpers/update-cat-number";
import { Admin } from "../../../models/admin/admin-schema";

interface EditProductBody {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  colorPropsListFromClient: ColorPropsFromClient[];
  description: string;
  productId: string;
  deletedImgaes: string[];
  selected_admin_username: string;
}

export const editProduct = async (
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
    productId,
    deletedImgaes,
    selected_admin_username,
  }: EditProductBody = req.body;

  // put keywords in search tags
  // const tagsRegex = /[\s-]+/g; // match all "space" and "dash-line"
  const tagsRegex = /[\s]+/g; // only match all "space"
  let searchTags: string[] = [...title.toLowerCase().split(tagsRegex)];
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

  const productUpdate = {
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
    createdDate: new Date(),
  };

  console.log("selected_admin_username------>", selected_admin_username);

  let admin_username: string;
  if (selected_admin_username !== "" && req.session.adminUser.isMasterAdmin) {
    admin_username = selected_admin_username;
  } else {
    admin_username = req.session.adminUser.admin_username;
  }

  console.log("admin_username------>", admin_username);

  const [adminUser] = await Promise.all([
    Admin.findOne({ admin_username }),
    Product.findOneAndUpdate({ _id: new ObjectId(productId) }, productUpdate, {
      new: true,
    }),
  ]);

  await Promise.all([
    updateFilterStats(main_cat, sub_cat),
    updateCategoryNumber(adminUser),
  ]);

  console.log("> > > product edited < < <");
  res.status(201).send({ main_cat, sub_cat });
};
