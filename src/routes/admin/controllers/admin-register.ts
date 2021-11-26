import { NextFunction, Request, Response } from "express";

// import nodemailer from "nodemailer";
// import nodemailerSendgrid from "nodemailer-sendgrid";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";

import { Admin } from "../../../models/admin/admin-schema";

export const adminRegister = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { admin_username, password } = req.body;
    console.log("admin register !!!!!");

    const existingAdmin = await Admin.findOne({ admin_username });

    if (existingAdmin) {
      return next(
        new Bad_Request_Error(
          "This ID is already registered by other administrator",
          "admin_username"
        )
      );
    }

    // no need to hash password here, we created a pre-save hook inside the User schema
    // to hash password whenever the it is modified
    const newAdmin = Admin.build({
      admin_username,
      password,
      product_ids: [],
      product_category: {},
    });

    await newAdmin.save();

    req.session.adminUser = {
      admin_username: newAdmin.admin_username,
      admin_id: newAdmin._id,
      loggedInAsAdmin: true,
    };

    res.status(201).send({
      message: "New Admin registered",
      adminUser: req.session.adminUser,
    });
  }
);
