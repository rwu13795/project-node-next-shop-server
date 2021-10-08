import { Request, Response, NextFunction } from "express";

import { tokens } from "../../../app";

import { UserDoc, UserInfo } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";

export interface CartItem {
  imageUrl: string;
  title: string;
  main_cat: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  colorName: string;
  availableQty?: number;
  stockErrors: {
    outOfStock?: string;
    notEnough?: string;
  };
}

export interface CurrentUser {
  username: string;
  cart: CartItem[];
  isLoggedIn: boolean;
  email?: string;
  userId?: string;
  userInfo?: UserInfo;
}

export const getUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.currentUser) {
    // "req.session.id" is the MongoDB id created when the "session-store"
    // saved the current session to the DB
    req.session.currentUser = {
      username: `guest__${req.session.id}`,
      cart: [],
      isLoggedIn: false,
    };

    // create and save the csrf_secret in each session for each user
    req.session.csrf_secret_user = tokens.secretSync();
  }

  if (req.session.currentUser.isLoggedIn) {
    const existingUser: UserDoc = await User.findById(
      req.session.currentUser.userId
    );
    req.session.currentUser.cart = existingUser.cartDetail.cart;
  }

  console.log(
    "checking session in get user auth---->",
    req.session.currentUser
  );

  // create a new token and send it to client each time the getAuthStatus is called
  const csrfToken = tokens.create(req.session.csrf_secret_user);
  console.log("token in get user auth", csrfToken);

  res.status(200).send({
    currentUser: req.session.currentUser,
    csrfToken,
  });
};
