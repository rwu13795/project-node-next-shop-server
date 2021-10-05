import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";
import { Product } from "../../../models/product/product-schema";
import { p_keys } from "../../../models/product/product-enums";
import { User } from "../../../models/user/user-schema";
import { UserDoc } from "../../../models/user/user-interfaces";

export const checkStock = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.currentUser) {
      return res.status(200).send([]);
    }

    if (req.session.currentUser.cart.length < 1) {
      return res.status(200).send(req.session.currentUser.cart);
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

    req.session.currentUser.cart = cart;
    if (req.session.isLoggedIn) {
      const user: UserDoc = await User.findById(req.session.currentUser.userId);
      user.cartDetail.cart = req.session.currentUser.cart;
      user.markModified("cartDetail");
      await user.save();
    }

    return res.status(200).send(req.session.currentUser.cart);
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

//   console.log(cart);
