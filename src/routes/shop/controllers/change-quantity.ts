import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";

export const changeQuantity = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { quantity, index }: { quantity: number; index: number } = req.body;

    req.session.currentUser.cart[index].quantity = quantity;

    // also update the cart in User DB if user is logged in
    if (req.session.currentUser.isLoggedIn) {
      return next();
    }

    res.status(201).send({ currentUser: req.session.currentUser });
  }
);
