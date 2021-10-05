import { NextFunction, Request, Response } from "express";
import { Bad_Request_Error } from "../../../middlewares";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { Product } from "../../../models/product/product-schema";

import deleteImages from "../helpers/delete-image-on-S3";

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId: string = req.body.productId;

  const product: ProductDoc = await Product.findById(productId);

  if (!product) {
    return next(new Bad_Request_Error("This product is not found in database"));
  }

  let imagesToBeDeleted: string[] = [];
  for (let prop of product.colorPropsList) {
    imagesToBeDeleted.push(...prop.imageFiles);
  }

  deleteImages(imagesToBeDeleted);
  const result = await Product.findByIdAndRemove(productId);

  console.log("> > > product deleted < < <", result);
  res.status(201).send({ message: "OK" });
};
