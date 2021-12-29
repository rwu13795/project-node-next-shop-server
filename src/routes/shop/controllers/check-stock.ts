import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";
import { Product } from "../../../models/product/product-schema";
import { p_keys } from "../../../models/product/product-enums";
import { User } from "../../../models/user/user-schema";
import { UserDoc } from "../../../models/user/user-interfaces";

interface StockError {
  index?: number;
  msg?: string;
}

export const checkStock = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.currentUser) {
      return res.status(200).send({ cart: [] });
    }

    if (req.session.currentUser.cart.length < 1) {
      return res.status(200).send({ cart: req.session.currentUser.cart });
    }

    let cart = req.session.currentUser.cart;

    // update the cart with the latest stock info, let the user know
    // which item in the cart is out of stock
    let ids = [];
    for (let item of cart) {
      ids.push(item.productId);
    }
    const stocks = await Product.find({ _id: { $in: ids } }).select([
      p_keys.stock,
      "_id",
    ]);

    for (let item of cart) {
      for (let s of stocks) {
        if (item.productId === s._id.toString()) {
          item.availableQty = s.stock.byColor[item.colorName][item.size];
          continue;
        }
      }
    }

    // update the session cart with the available stock
    // and map the stockErorrs for the client
    let stockErrors: StockError[] = [];
    let error: StockError;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].quantity > cart[i].availableQty && cart[i].availableQty > 0) {
        error = {
          index: i,
          msg: `Previously selected quantities (${cart[i].quantity}) not available`,
        };
        stockErrors.push(error);
        cart[i].quantity = cart[i].availableQty;
      }
      if (cart[i].availableQty === 0) {
        error = { index: i, msg: "Out of stock" };
        stockErrors.push(error);
        cart[i].quantity = 0;
      }
    }

    // update the session cart and User's cart in DB
    req.session.currentUser.cart = cart;
    if (req.session.currentUser.isLoggedIn) {
      const user: UserDoc = await User.findById(req.session.currentUser.userId);
      user.cartDetail.cart = req.session.currentUser.cart;
      user.markModified("cartDetail.cart");
      await user.save();
    }

    return res
      .status(200)
      .send({ cart: req.session.currentUser.cart, stockErrors });
  }
);

// let cart = [
//     { id: 13795, color: "blue", avalableQty: 13, size: "small" },
//     { id: 13795, color: "blue", avalableQty: 5, size: "large" },
//     { id: 2468, color: "red", avalableQty: 11, size: "medium" },
//   ];

//   let stock = [
//     {
//       id: 13795,
//       stock: { byColor: { ["blue"]: { ["small"]: 99, ["large"]: 0 } } },
//     },
//     {
//       id: 2468,
//       stock: { byColor: { ["red"]: { ["medium"]: 22, ["large"]: 11 } } },
//     },
//   ];

//   for (let item of cart) {
//     for (let s of stock) {
//       if (item.id === s.id) {
//         item.avalableQty = s.stock.byColor[item.color][item.size];
//         continue;
//       }
//     }
//   }
