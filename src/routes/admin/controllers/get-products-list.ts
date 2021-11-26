import { NextFunction, Request, Response } from "express";

import { asyncWrapper } from "../../../middlewares";
import { AdminDoc } from "../../../models/admin/admin-interfaces";
import { Admin } from "../../../models/admin/admin-schema";
import { p_keys } from "../../../models/product/product-enums";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { Product } from "../../../models/product/product-schema";

export const getProductsList = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin_username = req.session.adminUser.admin_username;
    let pageNum = parseInt(req.query.pageNum as string) || 1;
    let main_cat = req.query.main as string;
    let sub_cat = req.query.sub as string;

    console.log("main_cat ----------------->", main_cat);
    console.log("sub_cat ----------------->", sub_cat);
    console.log("pageNum ----------------->", pageNum);

    const [productsTotal, { product_category }]: [
      productsTotal: number,
      adminDoc: AdminDoc
    ] = await Promise.all([
      Product.countDocuments({
        admin_username,
        [p_keys.main_cat]: main_cat.toLowerCase(),
        [p_keys.sub_cat]: sub_cat.toLowerCase(),
      }),
      Admin.findOne({ admin_username }).select("product_category").lean(),
    ]);

    const ITEMS_PER_PAGE = 6;
    const skipToIndex = (pageNum - 1) * ITEMS_PER_PAGE;

    const products = await Product.find({
      admin_username,
      [p_keys.main_cat]: main_cat.toLowerCase(),
      [p_keys.sub_cat]: sub_cat.toLowerCase(),
    })
      .select([p_keys.colorPropsList, p_keys.productInfo, "_id"])
      .sort({ createdDate: -1 })
      .skip(skipToIndex)
      .limit(ITEMS_PER_PAGE)
      .lean();

    res.status(200).send({
      productsTotal,
      products,
      product_category,
    });
  }
);

// select products by using the IDs in admin //

//   products = await Product.find({
//     // _id: { $in: selected_ids },
//     admin_username,
//     [p_keys.main_cat]: main_cat.toLowerCase(),
//     [p_keys.sub_cat]: sub_cat.toLowerCase(),
//   })
//     .select([p_keys.colorPropsList, p_keys.productInfo, "_id"])
//     .sort({ createdDate: -1 })
//     .lean();
