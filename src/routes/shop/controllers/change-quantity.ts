import { Request, Response, NextFunction } from "express";

import { asyncWrapper } from "../../../middlewares";

export const changeQuantity = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { quantity, index }: { quantity: number; index: number } = req.body;

    req.session.currentUser.cart[index].quantity = quantity;

    console.log("direct change qty", req.session.currentUser.cart[index]);

    res.status(201).send({ currentUser: req.session.currentUser });
  }
);
