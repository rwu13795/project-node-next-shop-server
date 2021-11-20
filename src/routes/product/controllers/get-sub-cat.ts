import { Request, Response } from "express";
import { FilterQuery } from "mongoose";

import { Product } from "../../../models/product/product-schema";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { asyncWrapper } from "../../../middlewares";
import { p_keys } from "../../../models/product/product-enums";

interface Query {
  sizes?: string[];
  colors?: string[];
  priceSort?: number;
}

export const getSubCat = asyncWrapper(async (req: Request, res: Response) => {
  const { main_cat, sub_cat } = req.params;

  console.log("get sub cat", req.query);

  let filter: FilterQuery<ProductDoc>[] = [{ $and: [] }, { $and: [] }];
  let sorting = { createdDate: -1 };

  const colorFilter = [req.query.colors, "Brown"];
  const sizeFilter = [req.query.sizes];

  filter = colorFilter
    .map((color) => {
      return sizeFilter.map((size) => {
        return {
          $and: [
            { [p_keys.colorName]: { $eq: color } },
            { [`stock.byColor.${color}.${size}`]: { $gt: 1 } },
          ],
        };
      });
    })
    .flat();

  console.log(filter);

  const ITEMS_PER_PAGE = 6;
  let page = 1;
  if (typeof req.query.page === "string") {
    page = parseInt(req.query.page);
  }
  // I can use the computed property to replace the string "productInfo.sub_cat"
  let products = await Product.find({
    [p_keys.main_cat]: main_cat,
    [p_keys.sub_cat]: sub_cat,
    $or: filter,
    //]
    // {
    // $or: [
    // { [p_keys.colorName]: { $eq: "white" } },
    // { [p_keys.colorName]: { $eq: "Blue" } },
    // ],
    // },
    // { "colorPropsList.sizes.medium": { $gt: 1 } },
    // ],
  })
    .sort(sorting) // [p_keys.price]: -1
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    // I can also use the property key chain ("colorPropsList.imageFiles") to select the nested properties
    .select([p_keys.productInfo, p_keys.colorPropsList])
    .lean();

  // console.log(products);
  // console.log("> > > fetching product page: ", page);

  res.status(200).send({ products });
});
