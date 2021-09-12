import { NextFunction, Request, Response } from "express";

import asyncWrapper from "../../../middlewares/async-wrapper";
import { Product } from "../../../models/product";

export const getOneProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { color, size } = req.body;

    // use the "$in : [value]" to find one with such value in an array
    // specify the nested object property in a string `stock.byColor.${color}.total`
    const objectPath = `stock.byColor.${color}.total`;
    console.log(objectPath);
    const product = await Product.find({ [objectPath]: { $gt: 0 } }).lean();

    console.log(product);

    res.status(200).send({ message: "OK", result: product });
  }
);
