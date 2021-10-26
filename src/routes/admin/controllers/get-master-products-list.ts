import { NextFunction, Request, Response } from "express";

import { Not_Authorized_Error, asyncWrapper } from "../../../middlewares";
import { AdminDoc } from "../../../models/admin/admin-interfaces";
import { Admin } from "../../../models/admin/admin-schema";
import { p_keys } from "../../../models/product/product-enums";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { Product } from "../../../models/product/product-schema";

export const getMasterProductsList = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const admin_username = req.body.admin_username as string;
    let page_num = parseInt(req.query.page_num as string);

    console.log(req.query);

    const admin: AdminDoc = await Admin.findOne({ admin_username }).lean();

    if (!admin || !admin.master_admin) {
      return next(new Not_Authorized_Error());
    }

    const productsTotal = await Product.countDocuments();
    console.log("total", productsTotal);

    const PRODUCTS_PER_PAGE = 3;

    const products: ProductDoc = await Product.find()
      .skip((page_num - 1) * PRODUCTS_PER_PAGE)
      .limit(PRODUCTS_PER_PAGE)
      .select([p_keys.colorPropsList, p_keys.productInfo, "_id"])
      .lean();

    console.log("selected products", products);

    res.status(200).send({
      loggedInAsAdmin: req.session.adminUser.loggedInAsAdmin,
      productsTotal,
      products,
    });
  }
);
