import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";

import { asyncWrapper } from "../../../middlewares";
import { UserDoc } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";
import { inputNames } from "../../../utils/enums/input-names";

interface UpdateBody {
  [inputNames.first_name]: string;
  [inputNames.last_name]: string;
  [inputNames.address_1]: string;
  [inputNames.address_2]: string;
  [inputNames.city]: string;
  [inputNames.state]: string;
  [inputNames.zip_code]: string;
  [inputNames.phone]: string;
}

export const updateInfo = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const updateBody: UpdateBody = req.body.update;
    const userId: string = req.body.userId;

    const update = {
      userInfo: {
        [inputNames.first_name]: updateBody.first_name,
        [inputNames.last_name]: updateBody.last_name,
        [inputNames.phone]: updateBody.phone,
        [inputNames.address_1]: updateBody.address_1,
        [inputNames.address_2]: updateBody.address_2,
        [inputNames.state]: updateBody.state,
        [inputNames.city]: updateBody.city,
        [inputNames.zip_code]: updateBody.zip_code,
      },
    };

    const updatedUser: UserDoc = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      update,
      { new: true }
    );

    console.log("in update info -------------------------------");

    req.session.currentUser = {
      username: updatedUser.userInfo.first_name,
      cart: req.session.currentUser.cart,
      email: updatedUser.email,
      userId: updatedUser.id,
      userInfo: updatedUser.userInfo,
      isLoggedIn: true,
    };

    setTimeout(() => {
      res.status(201).send({ currentUser: req.session.currentUser });
    }, 3000);

    // res.status(201).send({ currentUser: req.session.currentUser });
  }
);
