import { NextFunction, Request, Response } from "express";

import {
  asyncWrapper,
  Bad_Request_Error,
  Not_Authorized_Error,
} from "../../../middlewares";
import { UserDoc } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";
import { inputNames } from "../../../utils/enums/input-names";
import { Password } from "../../../utils/hash-password";

export const resetPassword = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { old_password, new_password } = req.body;

    const existingUser: UserDoc = await User.findOne({
      email: req.session.currentUser.email,
    });

    if (!existingUser) {
      return next(new Not_Authorized_Error());
    }

    const checkPassword = await Password.compare(
      existingUser.password,
      old_password
    );
    if (!checkPassword) {
      return next(
        new Bad_Request_Error(
          "Old password is incorrect",
          inputNames.old_password
        )
      );
    }

    existingUser.password = new_password;
    await existingUser.save();

    res.status(201).send({
      message: "Password reset successfully",
    });
  }
);
