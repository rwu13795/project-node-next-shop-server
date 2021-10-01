import { Request, Response } from "express";

import { MenProduct } from "../../../models/product/product-schema";
import { asyncWrapper } from "../../../middlewares";
import {
  MainCategory,
  WomenCategory,
  MenCategory,
  KidsCategory,
  p_keys,
} from "../../../models/product/product-enums";

/* send (1) product id 
        (2) preview image Url for each color
        (3) an array contains all colors
*/

export const getSubCat = asyncWrapper(async (req: Request, res: Response) => {
  const { main_cat, sub_cat } = req.params;

  const ITEMS_PER_PAGE = 4;
  let page = 1;
  if (typeof req.query.page === "string") {
    page = parseInt(req.query.page);
  }
  // I can use the computed property to replace the string "productInfo.sub_cat"
  const products = await MenProduct.find({
    [p_keys.main_cat]: main_cat,
    [p_keys.sub_cat]: sub_cat,
  })
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    // I can also use the property key chain ("colorPropsList.imageFiles") to select the nested properties
    .select([p_keys.imageFiles, p_keys.title, p_keys.main_cat])
    .lean();

  // console.log(products);
  // console.log("> > > fetching product page: ", page);

  res.status(200).send({ products });
});
