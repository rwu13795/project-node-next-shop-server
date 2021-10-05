import { Request, Response, NextFunction } from "express";
import { asyncWrapper } from ".";
import { UserDoc } from "../models/user/user-interfaces";
import { User } from "../models/user/user-schema";

export const updateCartInDatebase = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: UserDoc = await User.findById(req.session.currentUser.userId);
    user.cartDetail.cart = req.session.currentUser.cart;
    user.markModified("cartDetail");
    console.log("saving change to DB !!!!!!!!!!!!!!!!!!!!!");
    await user.save();

    return res.status(201).send({
      currentUser: req.session.currentUser,
    });
  }
);
