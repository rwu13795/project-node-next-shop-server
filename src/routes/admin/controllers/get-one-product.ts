import { NextFunction, Request, Response } from "express";

import asyncWrapper from "../../../middlewares/async-wrapper";
import { Product } from "../../../models/product";

export const getOneProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { color, size } = req.body;

    // use the "$in : [value]" to find one with such value in an array
    const product = await Product.find({
      colors: { $in: [color] },
      sizes: { $in: [size] },
    });

    res.status(200).send({ message: "OK", result: product });
  }
);
