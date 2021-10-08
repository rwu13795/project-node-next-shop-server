import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";
import { UserDoc } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";

export const changeQuantity = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { quantity, index }: { quantity: number; index: number } = req.body;

    req.session.currentUser.cart[index].quantity = quantity;

    // also update the cart in User DB if user is logged in
    if (req.session.currentUser.isLoggedIn) {
      return next();
    }

    console.log("direct change qty", req.session.currentUser.cart[index]);

    res.status(201).send({ currentUser: req.session.currentUser });
  }
);
