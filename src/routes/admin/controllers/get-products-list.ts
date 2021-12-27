import { NextFunction, Request, Response } from "express";

import { asyncWrapper } from "../../../middlewares";
import { AdminDoc } from "../../../models/admin/admin-interfaces";
import { Admin } from "../../../models/admin/admin-schema";
import { p_keys } from "../../../models/product/product-enums";
import { ProductDoc } from "../../../models/product/product-interfaces";
import { Product } from "../../../models/product/product-schema";

export const getProductsList = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    let admin_username = req.session.adminUser.admin_username;
    let pageNum = parseInt(req.query.pageNum as string) || 1;
    let main_cat = req.query.main as string;
    let sub_cat = req.query.sub as string;

    let selectedAdmin = req.query.admin_username as string;

    if (req.session.adminUser.isMasterAdmin && selectedAdmin) {
      admin_username = selectedAdmin;
    }

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

    let admin_username_array = [];
    if (req.session.adminUser.isMasterAdmin) {
      admin_username_array = await Admin.find({})
        .select("admin_username")
        .lean();
      admin_username_array = admin_username_array.map((doc) => {
        return doc.admin_username;
      });
    }

    console.log(admin_username_array);

    if (selectedAdmin === undefined) {
      selectedAdmin = "";
    }

    res.status(200).send({
      productsTotal,
      products,
      product_category,
      admin_username_array,
      start_selectedAdmin: selectedAdmin,
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
