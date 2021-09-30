import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";

export const clearCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    req.session.currentUser.cart = [];

    res.status(201).send({ currentUser: req.session.currentUser });
  }
);
