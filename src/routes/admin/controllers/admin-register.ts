import { NextFunction, Request, Response } from "express";

// import nodemailer from "nodemailer";
// import nodemailerSendgrid from "nodemailer-sendgrid";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";

import { Admin } from "../../../models/admin/admin-schema";

export const adminRegister = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { admin_id, password } = req.body;
    console.log("admin register !!!!!");

    const existingAdmin = await Admin.findOne({ admin_id });

    if (existingAdmin) {
      return next(
        new Bad_Request_Error(
          "This ID is already registered by other administrator",
          "admin_id"
        )
      );
    }

    // no need to hash password here, we created a pre-save hook inside the User schema
    // to hash password whenever the it is modified
    const newAdmin = Admin.build({
      admin_id,
      password,
      product_ids: [],
    });

    await newAdmin.save();

    req.session.adminUser = {
      admin_id: newAdmin.admin_id,
      _id: newAdmin._id,
      loggedInAsAdmin: true,
    };

    res.status(201).send({
      message: "New Admin registered",
      adminUser: req.session.adminUser,
    });
  }
);
