import { Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";
import { asyncWrapper } from "../../../middlewares";
import { p_keys } from "../../../models/product/product-enums";

export const getAccessories = asyncWrapper(
  async (req: Request, res: Response) => {
    const main_cat = req.query.main_cat as string;

    const sub_cat_accessory = ["hats", "glasses", "socks"];
    const sub_cat_accessory_kids = ["hats", "socks"];

    let sub_cat: string[];
    if (main_cat === "kids") {
      sub_cat = sub_cat_accessory_kids;
    } else {
      sub_cat = sub_cat_accessory;
    }

    let queries = [];
    for (let cat of sub_cat) {
      queries.push(getAccessoriesQuery(main_cat, cat));
    }

    const [cat_1, cat_2, cat_3] = await Promise.all([...queries]);

    res.status(200).send({
      products: { cat_1, cat_2, cat_3 },
      subCatTitles: sub_cat,
    });
  }
);

function getAccessoriesQuery(main_cat: string, sub_cat: string) {
  return Product.find({
    [p_keys.main_cat]: main_cat,
    [p_keys.sub_cat]: sub_cat,
  })
    .sort({ createdDate: -1 })
    .select([p_keys.productInfo, p_keys.colorPropsList])
    .lean();
}
