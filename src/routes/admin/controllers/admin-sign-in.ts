import { NextFunction, Request, Response } from "express";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { UserDoc } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";
import { Password } from "../../../utils/hash-password";

export const adminSignIn = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { admin_id, password } = req.body;

    const existingAdmin: UserDoc = await User.findOne({ admin_id });

    if (!existingAdmin) {
      return next(new Bad_Request_Error("This ID does not exist", "admin_id"));
    }

    const checkPassword = await Password.compare(
      existingAdmin.password,
      password
    );
    if (!checkPassword) {
      return next(new Bad_Request_Error("Password is incorrect", "password"));
    }

    // after the user is signed in successfully, put the user info inside the
    // DB, so that we can use the info to find the user-DB-instance

    req.session.admin_id = admin_id;

    // to test the loading spinner by delaying the response
    setTimeout(() => {
      res.status(200).send({
        message: "Admin logged in",
        admin_id: req.session.admin_id,
      });
    }, 3000);

    // res.status(200).send({
    //   message: "Logged in",
    //   currentUser: req.session.currentUser,
    //   isLoggedIn: req.session.isLoggedIn,
    // });
  }
);
