import { NextFunction, Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { MainCategory, p_keys } from "../../../models/product/product-enums";
import mongoose from "mongoose";
import updateFilterStats from "../../admin/helpers/update-filter-stats";

export const updateStock = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = req.session.currentUser.cart;

    const categorySet = new Set<string>();

    for (let item of cart) {
      let query = {
        _id: item.productId,
        colorPropsList: { $elemMatch: { colorName: item.colorName } },
      };

      categorySet.add(`${item.main_cat}@${item.sub_cat}`);

      let update = {
        $inc: {
          [`stock.byColor.${item.colorName}.${item.size}`]: -item.quantity,
          [`stock.byColor.${item.colorName}.total`]: -item.quantity,
          [`stock.bySize.${item.size}.${item.colorName}`]: -item.quantity,
          [`stock.bySize.${item.size}.total`]: -item.quantity,
          [`colorPropsList.$.sizes.${item.size}`]: -item.quantity,
        },
      };

      await Product.findOneAndUpdate(query, update);
    }

    for (let value of categorySet.values()) {
      const [main_cat, sub_cat] = value.split("@");
      await updateFilterStats(main_cat, sub_cat);
    }

    res.status(201).send({ message: "OK" });
  }
);

/* Old method, it works, but if the same document is being read or written by other
   request, then race condition will occur.
   I need to use the MongoDB query to update the stock, since MongoDB will lock the
   document while it is being updated

////////////////////
      let product = await Product.findById(item.productId);

      if (product) {
        product.stock.byColor[item.colorName][item.size] -= item.quantity;
        product.stock.byColor[item.colorName].total -= item.quantity;
        product.stock.bySize[item.size][item.colorName] -= item.quantity;
        product.stock.bySize[item.size].total -= item.quantity;

        for (let colorProp of product.colorPropsList) {
          if (colorProp.colorName === item.colorName) {
            colorProp.sizes[item.size] -= item.quantity;
            break;
          }
        }
        // NOTE //
        // when updating value in the nested object, you have to use the "markModified"
        // function to mark the root "key" of the nested object in order to save the changes
        product.markModified("stock");
        product.markModified("colorPropsList");
        await product.save();
      }
////////////////////

*/
// Other example
// UserModel.findOneAndUpdate({_id: 1, notifications: {$elemMatch: {id: 2}}},
//   {$set: {'notifications.$.title': req.body.title,
//           'notifications.$.body': req.body.body,}}, // list fields you like to change
//   {'new': true, 'safe': true, 'upsert': true});
