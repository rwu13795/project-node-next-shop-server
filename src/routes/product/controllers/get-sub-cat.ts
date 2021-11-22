import { Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";
import { asyncWrapper } from "../../../middlewares";
import { p_keys } from "../../../models/product/product-enums";
import productFilter from "../helpers/product-filter";

interface Filter {
  sizes?: string[];
  colors?: string[];
  priceSort?: number;
}

export const getSubCat = asyncWrapper(async (req: Request, res: Response) => {
  const { main_cat, sub_cat } = req.params;

  console.log("get sub cat query", req.query);
  let query_page = req.query.page as string;
  let query_filter = req.query.filter as string;

  let page: number;
  if (query_page) {
    page = parseInt(query_page);
  } else {
    page = 1;
  }

  let colors: string[] = [];
  let sizes: string[] = [];
  let db_filter: any = [{}];
  let sorting = { createdDate: -1 };

  if (req.query.filter) {
    let filter: Filter = JSON.parse(query_filter);
    colors = filter.colors;
    sizes = filter.sizes;

    if (colors.length > 0 || sizes.length > 0) {
      db_filter = productFilter(colors, sizes);
    }

    console.log("db_filter", db_filter);
  }

  const ITEMS_PER_PAGE = 6;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // I can use the computed property to replace the string "productInfo.sub_cat"
  let products = await Product.find({
    [p_keys.main_cat]: main_cat,
    [p_keys.sub_cat]: sub_cat,
    $or: db_filter,
  })
    .sort(sorting) // [p_keys.price]: -1
    .select([p_keys.productInfo, p_keys.colorPropsList])
    .lean();

  // count the availability of the filter
  /************************************* */

  // can't use the ".skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)" here,
  // because I have to count the available colors and sizes when the filter is being used
  products = products.slice(startIndex, endIndex);

  console.log("products---------------", products);

  res.status(200).send({ products });
});
