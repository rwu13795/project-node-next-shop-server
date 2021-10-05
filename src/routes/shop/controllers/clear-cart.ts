import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";

export const clearCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (
      req.session.currentUser.cart !== undefined ||
      req.session.currentUser.cart.length > 0
    ) {
      req.session.currentUser.cart = [];
    }

    if (req.session.isLoggedIn) {
      return next();
    }

    res.status(201).send({ currentUser: req.session.currentUser });
  }
);
