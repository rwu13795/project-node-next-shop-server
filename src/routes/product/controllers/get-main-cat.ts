import { Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";
import { asyncWrapper } from "../../../middlewares";
import { p_keys } from "../../../models/product/product-enums";

export const getMainCat = asyncWrapper(async (req: Request, res: Response) => {
  const { main_cat } = req.params;

  const sub_cat_men = ["t-shirts", "hoodies", "shorts", "jeans"];
  const sub_cat_women = ["t-shirts", "blouses", "shorts", "dresses"];
  const sub_cat_kids = ["t-shirts", "sweaters", "shorts", "jeans"];

  let sub_cat: string[];
  if (main_cat === "men") {
    sub_cat = sub_cat_men;
  } else if (main_cat === "women") {
    sub_cat = sub_cat_women;
  } else {
    sub_cat = sub_cat_kids;
  }

  const query_1 = getSubCatPreview(main_cat, sub_cat[0]);
  const query_2 = getSubCatPreview(main_cat, sub_cat[1]);
  const query_3 = getSubCatPreview(main_cat, sub_cat[2]);
  const query_4 = getSubCatPreview(main_cat, sub_cat[3]);

  const [cat_1, cat_2, cat_3, cat_4] = await Promise.all([
    query_1,
    query_2,
    query_3,
    query_4,
  ]);

  res
    .status(200)
    .send({ products: { cat_1, cat_2, cat_3, cat_4 }, subCatTitles: sub_cat });
});

function getSubCatPreview(main_cat: string, sub_cat: string) {
  return Product.find({
    [p_keys.main_cat]: main_cat,
    [p_keys.sub_cat]: sub_cat,
  })
    .sort({ createdDate: -1 })
    .limit(4)
    .select([p_keys.productInfo, p_keys.colorPropsList])
    .lean();
}
