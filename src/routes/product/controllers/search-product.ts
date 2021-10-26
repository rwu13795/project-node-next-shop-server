import { NextFunction, Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { p_keys } from "../../../models/product/product-enums";

// need to add more matching keys
const mainCat = { men: "men", women: "women", kids: "kids" };
const subCat = { "t-shirt": "t-shirts", "t-shirts": "t-shirts" };

export const searchProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const text = req.query.text as string;
    const keywords = text.toLowerCase().split("-");

    let filter: { main_cat?: string; sub_cat?: string } = {};

    for (let key of keywords) {
      if (mainCat[key] !== undefined) {
        filter.main_cat = mainCat[key];
      }
      if (subCat[key] !== undefined) {
        filter.sub_cat = subCat[key];
      }
    }

    let products = await Product.find({
      ...filter,
      searchTags: { $in: keywords },
    })
      .select(p_keys.productInfo)
      .lean();

    res.status(201).send({ message: products });
  }
);
