import { Request, Response, NextFunction } from "express";
import { UserAddressFields } from "../../../models/user/user-interfaces";

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
  firstName?: string;
  lastName?: string;
  phone?: string;
  shippingAddress?: UserAddressFields[];
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
  }

  console.log(
    "checking currentUser ---->",
    req.session.currentUser,
    req.session.isLoggedIn
  );

  res.status(200).send({
    currentUser: req.session.currentUser,
    isLoggedIn: req.session.isLoggedIn,
  });
};
