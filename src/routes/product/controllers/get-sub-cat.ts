import { Request, Response } from "express";

import {
  KidsProduct,
  WomenProduct,
  MenProduct,
} from "../../../models/product/product-schema";
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

  let products;
  switch (main_cat) {
    case MainCategory.men:
      products = await MenProduct.find({ main_cat, sub_cat })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .select([p_keys.colorPropsList, p_keys.title])
        .lean();
      break;
    case MainCategory.women:
      break;
    case MainCategory.kids:
      break;
    default:
      break;
  }

  console.log("> > > fetching product page: ", page);

  res.status(200).send({ products });
});