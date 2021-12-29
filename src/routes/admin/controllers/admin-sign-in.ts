import { NextFunction, Request, Response } from "express";
import { tokens } from "../../../app";

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
      isMasterAdmin: existingAdmin.master_admin,
    };

    req.session.csrf_secret_admin = tokens.secretSync();

    const csrfToken = tokens.create(req.session.csrf_secret_admin);

    res.status(200).send({
      adminUser: req.session.adminUser,
      csrfToken,
    });
  }
);
