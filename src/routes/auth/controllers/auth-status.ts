import { Request, Response, NextFunction } from "express";
import { tokens } from "../../../app";
import { UserInfo } from "../../../models/user/user-interfaces";

export interface CartItem {
  imageUrl: string;
  title: string;
  main_cat: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  colorName: string;
  totalQty?: number;
}

export interface CurrentUser {
  username: string;
  cart: CartItem[];
  email?: string;
  userId?: string;
  userInfo?: UserInfo;
}

export const getAuthStatus = async (
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
    };
    req.session.isLoggedIn = false;
    // create and save the csrf_secret in each session for each user
    req.session.csrf_secret = tokens.secretSync();
  }

  console.log(
    "checking currentUser ---->",
    req.session.currentUser,
    req.session.isLoggedIn
  );

  // create a new token and send it to client each time the getAuthStatus is called
  const csrfToken = tokens.create(req.session.csrf_secret);
  console.log("token in get auth", csrfToken);

  res.status(200).send({
    currentUser: req.session.currentUser,
    isLoggedIn: req.session.isLoggedIn,
    csrfToken,
  });
};
