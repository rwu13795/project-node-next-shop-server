import { NextFunction, Request, Response } from "express";
import { Bad_Request_Error } from "../../../middlewares";
import { AdminDoc } from "../../../models/admin/admin-interfaces";
import { Admin } from "../../../models/admin/admin-schema";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { Product } from "../../../models/product/product-schema";

import deleteImages from "../helpers/delete-image-on-S3";

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId: string = req.body.productId;
  const admin_username: string = req.body.admin_username;

  const [product, adminUser]: [ProductDoc, AdminDoc] = await Promise.all([
    Product.findById(productId),
    Admin.findOne({ admin_username }),
  ]);

  // const product: ProductDoc = await Product.findById(productId);
  // const adminUser: AdminDoc = await Admin.findOne({ admin_username });

  if (!product || !adminUser) {
    return next(
      new Bad_Request_Error("Something wrong with the product_id or admin_id")
    );
  }

  let imagesToBeDeleted: string[] = [];
  for (let prop of product.colorPropsList) {
    imagesToBeDeleted.push(...prop.imageFiles);
  }

  deleteImages(imagesToBeDeleted);

  adminUser.product_ids = adminUser.product_ids.filter(
    (id) => id.toString() !== productId.toString()
  );

  const result = await Promise.all([
    adminUser.save(),
    Product.findByIdAndRemove(productId),
  ]);

  console.log("> > > product deleted < < <", result);
  res.status(201).send({ message: "OK" });
};
