import { NextFunction, Request, Response } from "express";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { User } from "../../../models/user/user-schema";
import { UserDoc } from "../../../models/user/user-interfaces";

export const tokenCheck = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    // {$gt: Date.new()} is Moogoose method to check if resetTokenExpiration is greated than the current time
    const userWithValidToken: UserDoc = await User.findOne({
      resetToken: token,
      isValidToken: true,
      resetTokenExpiration: { $gt: Date.now() },
      // the Mongoose will convert the DB timestamp to the local Node server time for comparison
    });

    if (!userWithValidToken) {
      return next(new Bad_Request_Error("Reset link expired"));
    }

    res.status(200).send({
      userId: userWithValidToken._id,
      expiration: userWithValidToken.resetTokenExpiration - Date.now(),
    });
  }
);
