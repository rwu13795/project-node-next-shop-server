import { NextFunction, Request, Response } from "express";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { AdminDoc } from "../../../models/admin/admin-interfaces";
import { Admin } from "../../../models/admin/admin-schema";
import { Password } from "../../../utils/hash-password";

export const adminSignIn = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { admin_username, password } = req.body;

    const existingAdmin: AdminDoc = await Admin.findOne({ admin_username });

    if (!existingAdmin) {
      return next(
        new Bad_Request_Error("This ID does not exist", "admin_username")
      );
    }

    const checkPassword = await Password.compare(
      existingAdmin.password,
      password
    );
    if (!checkPassword) {
      return next(new Bad_Request_Error("Password is incorrect", "password"));
    }

    req.session.adminUser = {
      admin_username: existingAdmin.admin_username,
      admin_id: existingAdmin._id,
      loggedInAsAdmin: true,
    };

    // to test the loading spinner by delaying the response
    setTimeout(() => {
      res.status(200).send({
        message: "Admin logged in",
        adminUser: req.session.adminUser,
      });
    }, 3000);

    // res.status(200).send({
    //   message: "Logged in",
    //   currentUser: req.session.currentUser,
    //   isLoggedIn: req.session.isLoggedIn,
    // });
  }
);
