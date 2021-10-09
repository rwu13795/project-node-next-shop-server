import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";

export const removeFromCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const index: number = req.body.index;

    req.session.currentUser.cart.splice(index, 1);

    // also update the cart in User DB if user is logged in
    if (req.session.currentUser.isLoggedIn) {
      return next();
    }

    res.status(201).send({ currentUser: req.session.currentUser });
  }
);
