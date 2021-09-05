import { NextFunction, Request, Response } from "express";

import asyncWrapper from "../../../middlewares/async-wrapper";
import { Product } from "../../../models/product";

export const getOneProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { p_id } = req.body;

    const product = await Product.findById({ _id: p_id });

    await product.populate("stock_ref");

    res.status(200).send({ message: "OK", result: product });
  }
);
