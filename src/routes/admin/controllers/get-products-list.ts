import { NextFunction, Request, Response } from "express";

import { Not_Authorized_Error, asyncWrapper } from "../../../middlewares";
import { AdminDoc } from "../../../models/admin/admin-interfaces";
import { Admin } from "../../../models/admin/admin-schema";
import { p_keys } from "../../../models/product/product-enums";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { Product } from "../../../models/product/product-schema";

export const getProductsList = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin_username = req.session.adminUser.admin_username;
    let pageNum = parseInt(req.query.page_num as string) | 1;

    console.log(admin_username);

    const [productsTotal, { product_ids }]: [
      productsTotal: number,
      adminDoc: AdminDoc
    ] = await Promise.all([
      Product.countDocuments({ admin_username }),
      Admin.findOne({ admin_username }).select("product_ids").lean(),
    ]);

    console.log("product total", productsTotal);
    console.log("product_ids", product_ids);

    let products;
    if (product_ids && product_ids.length > 0) {
      const PRODUCTS_PER_PAGE = 10;
      const starIndex = (pageNum - 1) * PRODUCTS_PER_PAGE;
      const endIndex =
        starIndex + PRODUCTS_PER_PAGE < productsTotal
          ? starIndex + PRODUCTS_PER_PAGE
          : productsTotal;
      const selected_ids = product_ids.slice(starIndex, endIndex);

      products = await Product.find({ _id: { $in: selected_ids } })
        .select([p_keys.colorPropsList, p_keys.productInfo, "_id"])
        .lean();
    } else {
      products = null;
    }

    res.status(200).send({
      productsTotal,
      products,
    });
  }
);
