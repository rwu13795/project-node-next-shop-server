import { NextFunction, Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { p_keys } from "../../../models/product/product-enums";

// need to add more matching keys
const mainCat = { men: "men", women: "women", kids: "kids" };
const subCat = {
  "t-shirt": "t-shirts",
  "t-shirts": "t-shirts",
  shirt: "shirts",
  short: "shorts",
  shorts: "shorts",
};

const colorsMap = { lime: "Lime", black: "Black" };

export const searchProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const search = req.query.search as string;
    const keywords = search.toLowerCase().split(" ");
    const page = parseInt(req.query.page as string) || 1;
    const ITEMS_PER_PAGE = 6;

    console.log("text--------->", search);
    console.log("keywords--------->", keywords);
    console.log("page----->", page);

    // try to match the keywords with the main, sub and color
    let filter = {};
    for (let key of keywords) {
      if (mainCat[key] !== undefined) {
        // main_cat = mainCat[key];
        filter[p_keys.main_cat] = mainCat[key];
      }
      if (subCat[key] !== undefined) {
        // sub_cat = subCat[key];
        filter[p_keys.sub_cat] = subCat[key];
      }
      if (colorsMap[key] !== undefined) {
        // colorName = colorsMap[key]
        filter[p_keys.colorName] = colorsMap[key];
      }
    }
    // if none of keywords matches any category, use the searchTag in the DB
    if (Object.keys(filter).length === 0) {
      filter = { searchTags: { $in: keywords } };
    }

    console.log(filter);

    let products = await Product.find({
      ...filter,
      // [p_keys.main_cat]: main_cat,
      // [p_keys.sub_cat]: sub_cat,
      // if any one of the keywords matched, get that document
      // searchTags: { $in: keywords },
    })
      .sort({ createdDate: -1 })
      .select([p_keys.productInfo, p_keys.colorPropsList])
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .lean();

    res.status(201).send({ products });
  }
);
