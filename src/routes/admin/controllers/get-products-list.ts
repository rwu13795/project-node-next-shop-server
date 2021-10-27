import { NextFunction, Request, Response } from "express";

import { Not_Authorized_Error, asyncWrapper } from "../../../middlewares";
import { AdminDoc } from "../../../models/admin/admin-interfaces";
import { Admin } from "../../../models/admin/admin-schema";
import { p_keys } from "../../../models/product/product-enums";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { Product } from "../../../models/product/product-schema";

export const getProductsList = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin_username = req.query.admin_username as string;
    let page_num = parseInt(req.query.page_num as string);

    console.log(req.query);

    const productsTotal = await Product.countDocuments({ admin_username });
    console.log("total", productsTotal);

    const { product_ids }: AdminDoc = await Admin.findOne({ admin_username })
      .select("product_ids")
      .lean();

    console.log("product_ids", product_ids);

    let products;
    if (product_ids && product_ids.length > 0) {
      const PRODUCTS_PER_PAGE = 3;
      const starIndex = (page_num - 1) * PRODUCTS_PER_PAGE;
      const endIndex =
        starIndex + PRODUCTS_PER_PAGE < productsTotal
          ? starIndex + PRODUCTS_PER_PAGE
          : productsTotal;
      const selected_ids = product_ids.slice(starIndex, endIndex);

      console.log(selected_ids);

      products = await Product.find({ _id: { $in: selected_ids } })
        .select([p_keys.colorPropsList, p_keys.productInfo, "_id"])
        .lean();
    } else {
      products = null;
    }

    console.log("selected products", products);

    res.status(200).send({
      loggedInAsAdmin: req.session.adminUser.loggedInAsAdmin,
      productsTotal,
      products,
    });
  }
);
