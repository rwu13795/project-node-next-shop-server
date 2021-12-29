import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";
import { CartItem } from "../../auth/controllers";

interface Body {
  item: CartItem;
  editMode?: boolean;
  index?: number;
}

export const addToCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { item, editMode, index }: Body = req.body;

    // when the user tried to change the quantity after the session has expired
    if (!req.session.currentUser) {
      req.session.currentUser = {
        username: `guest__${req.session.id}`,
        cart: [item],
        isLoggedIn: false,
      };
      req.session.currentUser.isLoggedIn = false;
      return res.status(201).send({
        currentUser: req.session.currentUser,
      });
    }

    if (editMode) {
      for (let i of req.session.currentUser.cart) {
        if (
          i.productId === item.productId &&
          i.colorName === item.colorName &&
          i.size === item.size
        ) {
          if (index !== req.session.currentUser.cart.indexOf(i)) {
            // the new update is the same as the existing item, so just add the quantity
            // and then remove the old item from the cart
            // splice will modify the array, and return the deleled elements
            i.quantity = i.quantity + item.quantity;
            req.session.currentUser.cart.splice(index, 1);
          } else {
            // change the quantity of the same item
            i.quantity = item.quantity;
          }
          // update the cart in DB
          if (req.session.currentUser.isLoggedIn) {
            return next();
          }
          return res.status(201).send({
            currentUser: req.session.currentUser,
          });
        }
      }
      // if not updating the same item, that means user needs to change size/color
      // so I replace the targeted item with the new updated item
      req.session.currentUser.cart[index] = item;

      // also update the cart in User DB if user is logged in
      if (req.session.currentUser.isLoggedIn) {
        return next();
      }
      return res.status(201).send({
        currentUser: req.session.currentUser,
      });
    }

    // add quantity for the same existing item
    for (let i of req.session.currentUser.cart) {
      if (
        i.productId === item.productId &&
        i.colorName === item.colorName &&
        i.size === item.size
      ) {
        i.quantity = i.quantity + item.quantity;

        // also update the cart in User DB if user is logged in
        if (req.session.currentUser.isLoggedIn) {
          return next();
        }
        return res.status(201).send({
          currentUser: req.session.currentUser,
        });
      }
    }

    // add new item to cart
    req.session.currentUser.cart.push(item);
    // also update the cart in User DB if user is logged in
    if (req.session.currentUser.isLoggedIn) {
      return next();
    }

    return res.status(201).send({
      currentUser: req.session.currentUser,
    });
  }
);
