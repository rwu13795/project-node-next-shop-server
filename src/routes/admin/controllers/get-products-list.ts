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
    let pageNum = parseInt(req.query.pageNum as string) || 1;

    console.log("pageNum", pageNum);

    const [productsTotal, { product_ids }]: [
      productsTotal: number,
      adminDoc: AdminDoc
    ] = await Promise.all([
      Product.countDocuments({ admin_username }),
      Admin.findOne({ admin_username }).select("product_ids").lean(),
    ]);

    let products;
    if (product_ids && product_ids.length > 0) {
      const PRODUCTS_PER_PAGE = 6;
      const starIndex = (pageNum - 1) * PRODUCTS_PER_PAGE;
      const endIndex =
        starIndex + PRODUCTS_PER_PAGE < productsTotal
          ? starIndex + PRODUCTS_PER_PAGE
          : productsTotal;
      const selected_ids = product_ids.slice(starIndex, endIndex);

      console.log("selected_ids", selected_ids);

      products = await Product.find({
        _id: { $in: selected_ids },
      })
        .select([p_keys.colorPropsList, p_keys.productInfo, "_id"])
        .sort({ createdDate: -1 })
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
