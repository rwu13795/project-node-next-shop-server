import { NextFunction, Request, Response } from "express";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { User } from "../../../models/user/user-schema";
import { UserDoc } from "../../../models/user/user-interfaces";

export const forgotPassword_Reset = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, userId, new_password } = req.body;

    const userWithValidToken: UserDoc = await User.findOne({
      userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
      // the Mongoose will convert the DB timestamp to the local Node server time for comparison
    });

    if (!userWithValidToken) {
      console.log("Reset link expired");
      return next(new Bad_Request_Error("Reset link expired", "expired-link"));
    }

    userWithValidToken.password = new_password;
    await userWithValidToken.save();

    console.log("Password reset");
    res.status(201).send();
  }
);