import { NextFunction, Request, Response } from "express";
import { CartItem } from ".";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { UserDoc } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";
import { inputNames } from "../../../utils/enums/input-names";
import { Password } from "../../../utils/hash-password";

export const signIn = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser: UserDoc = await User.findOne({ email });

    if (!existingUser) {
      return next(
        new Bad_Request_Error("This email does not exist", inputNames.email)
      );
    }

    const checkPassword = await Password.compare(
      existingUser.password,
      password
    );
    if (!checkPassword) {
      return next(
        new Bad_Request_Error("Password is incorrect", inputNames.password)
      );
    }

    // retrieve the cart from the existing user's record, and merge the cart which
    // is added when the user is guest user, with the existing cart
    // if the existing cart is expired, then use the guest user's cart
    console.log("req.session", req.session);

    let cart: CartItem[];
    if (req.session.currentUser?.cart) {
      cart = req.session.currentUser.cart;
    } else {
      cart = [];
    }

    const userCartExpiration = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
    if (
      !existingUser.cartDetail.expireAt ||
      existingUser.cartDetail.cart.length < 1
    ) {
      existingUser.cartDetail = { cart, expireAt: userCartExpiration };
    } else {
      const userWithCartSession = await User.findOne({
        _id: existingUser._id,
        "cartDetail.expireAt": { $gt: Date.now() },
      });
      // if there is a identical item in the cart DB, then merge the cart
      // else add the new item to the cart DB
      if (userWithCartSession) {
        for (let item of cart) {
          let isSameItem = false;
          for (let userItem of existingUser.cartDetail.cart) {
            if (
              userItem.productId === item.productId &&
              userItem.colorName === item.colorName &&
              userItem.size === item.size
            ) {
              userItem.quantity += item.quantity;
              isSameItem = true;
              break;
            }
          }
          if (!isSameItem) {
            existingUser.cartDetail.cart.push(item);
          }
        }
        // update the user cart session
        existingUser.cartDetail.expireAt = userCartExpiration;
      } else {
        // when the cart in DB is expired
        existingUser.cartDetail = {
          cart,
          expireAt: userCartExpiration,
        };
      }
    }
    existingUser.markModified("cartDetail");
    await existingUser.save();

    // after the user is signed in successfully, put the user info inside the
    // DB, so that we can use the info to find the user-DB-instance
    req.session.currentUser = {
      username: existingUser.userInfo.first_name,
      cart: existingUser.cartDetail.cart,
      email: existingUser.email,
      userId: existingUser.id,
      userInfo: existingUser.userInfo,
      isLoggedIn: true,
    };

    // to test the loading spinner by delaying the response
    setTimeout(() => {
      res.status(200).send({
        currentUser: req.session.currentUser,
      });
    }, 3000);

    // res.status(200).send({
    //   message: "Logged in",
    //   currentUser: req.session.currentUser,
    //   isLoggedIn: req.session.isLoggedIn,
    // });
  }
);
