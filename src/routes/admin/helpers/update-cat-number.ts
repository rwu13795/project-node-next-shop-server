import {
  AdminDoc,
  ProductCatAdmin,
} from "../../../models/admin/admin-interfaces";
import { p_keys } from "../../../models/product/product-enums";
import { Product } from "../../../models/product/product-schema";

export default async function updateCategoryNumber(adminDoc: AdminDoc) {
  const products = await Product.find({ admin_id: adminDoc._id })
    .select([p_keys.productInfo])
    .lean();

  let product_category: ProductCatAdmin = {};

  for (let product of products) {
    let { main_cat, sub_cat } = product.productInfo;
    if (product_category[main_cat] === undefined) {
      // adding new Main and Sub cat
      let newCat = { [main_cat]: { [sub_cat]: 1 } };
      product_category = { ...product_category, ...newCat };
    } else {
      if (product_category[main_cat][sub_cat] === undefined) {
        // adding new Sub cat
        product_category[main_cat][sub_cat] = 1;
      } else {
        product_category[main_cat][sub_cat] += 1;
      }
    }
  }

  adminDoc.product_category = { ...product_category };

  adminDoc.markModified("product_category");

  await adminDoc.save();
}
