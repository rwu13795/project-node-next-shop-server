import { NextFunction, Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";
import { asyncWrapper } from "../../../middlewares";
import { p_keys } from "../../../models/product/product-enums";
import {
  main_cat,
  sub_cat,
  colors_map,
} from "../../../models/product/product-enums";

export const searchProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const search = req.query.search as string;
    const keywords = search.toLowerCase().split(" ");
    const page = parseInt(req.query.page as string) || 1;
    const ITEMS_PER_PAGE = 6;

    // try to match the keywords with the main, sub and color
    let filter = {};
    for (let key of keywords) {
      if (main_cat[key] !== undefined) {
        filter[p_keys.main_cat] = main_cat[key];
      }
      if (sub_cat[key] !== undefined) {
        filter[p_keys.sub_cat] = sub_cat[key];
      }
      if (colors_map[key] !== undefined) {
        filter[p_keys.colorName] = colors_map[key];
      }
    }
    // if none or only one of keywords matches any category,
    // add the searchTag in the filter
    if (Object.keys(filter).length < 2) {
      filter = { ...filter, searchTags: { $in: keywords } };
    }

    let products = await Product.find({
      ...filter,
    })
      .sort({ createdDate: -1 })
      .select([p_keys.productInfo, p_keys.colorPropsList])
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .lean();

    res.status(201).send({ products });
  }
);
