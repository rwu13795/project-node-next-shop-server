import { NextFunction, Request, Response } from "express";

import asyncWrapper from "../../../middlewares/async-wrapper";
import { NotFoundError } from "../../../middlewares/error-handler/not-found-error";
import { MenProduct } from "../../../models/men-product";

export const getOneProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { color, size, id } = req.body;

    // use the "$in : [value]" to find one with such value in an array
    // specify the nested object property in a string `stock.byColor.${color}.total`
    const objectPath = `stock.byColor.${color}.total`;
    console.log(objectPath);
    const product = await MenProduct.find({ [objectPath]: { $gt: 0 } }).lean();

    if (product.length < 1) {
      return next(new NotFoundError());
    }

    if (id.length !== 24) {
      return next(new NotFoundError());
    }

    // const product = await Product.findById(id);
    // console.log(product);
    // if (!product) {
    //   return next(new notFoundError());
    // }

    res.status(200).send({ message: "OK", result: product });
  }
);
