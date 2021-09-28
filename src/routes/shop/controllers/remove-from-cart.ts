import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";

export const removeFromCart = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const index: number = req.body.index;

    console.log(index);

    req.session.currentUser.cart.splice(index, 1);

    res.status(201).send({ currentUser: req.session.currentUser });
  }
);
