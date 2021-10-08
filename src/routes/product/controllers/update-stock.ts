import { NextFunction, Request, Response } from "express";

import { Product } from "../../../models/product/product-schema";
import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { MainCategory, p_keys } from "../../../models/product/product-enums";
import mongoose from "mongoose";

export const updateStock = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const cart = req.session.currentUser.cart;

    for (let item of cart) {
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
    }

    res.status(201).send({ message: "OK" });
  }
);
