import { NextFunction, Request, Response } from "express";

import { Bad_Request_Error, asyncWrapper } from "../../../middlewares";
import { Product } from "../../../models/product/product-schema";

export const getOneProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { color, size, id } = req.body;

    // use the "$in : [value]" to find one with such value in an array
    // specify the nested object property in a string `stock.byColor.${color}.total`
    const objectPath = `stock.byColor.${color}.total`;
    console.log(objectPath);
    const product = await Product.find({ [objectPath]: { $gt: 0 } }).lean();

    if (product.length < 1) {
      return next(new Bad_Request_Error("Product not found", "field"));
    }

    if (id.length !== 24) {
      return next(new Bad_Request_Error("Product not found", "field"));
    }

    // const product = await Product.findById(id);
    // console.log(product);
    // if (!product) {
    //   return next(new notFoundError());
    // }

    res.status(200).send({ message: "OK", result: product });
  }
);
