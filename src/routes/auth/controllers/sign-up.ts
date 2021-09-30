import { NextFunction, Request, Response } from "express";
// import nodemailer from "nodemailer";
// import nodemailerSendgrid from "nodemailer-sendgrid";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { UserAddressFields } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";

// const mailTransporter = nodemailer.createTransport(
//   nodemailerSendgrid({
//     apiKey: process.env.SENDGRID_API_KEY,
//   })
// );

interface SignUpBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  addressInfo: UserAddressFields;
}

export const signUp = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      addressInfo,
    }: SignUpBody = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(
        new Bad_Request_Error(
          "This email address is already used by other user",
          "email"
        )
      );
    }

    // no need to hash password here, we created a pre-save hook inside the User schema
    // to hash password whenever the it is modified
    const newUser = User.build({
      firstName,
      lastName,
      email,
      password,
      phone,
      addressInfo,
    });

    await newUser.save();

    console.log(newUser);

    req.session.currentUser = {
      username: newUser.firstName,
      cart: [],
      email: newUser.email,
      userId: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      addressInfo: newUser.addressInfo,
    };
    req.session.isLoggedIn = true;

    /******/
    // send a email telling the user the signup is successful
    // mailTransporter.sendMail({
    //   from: "rwu13795.work@gmail.com",
    //   to: email,
    //   subject: "Thank you for signing up!",
    //   html: "<h1>You successfully signed up to the Next-Node-Shop!</h1>",
    // });
    // console.log("Email sent to " + email);
    /******/

    res.status(201).send({
      currentUser: req.session.currentUser,
      isLoggedIn: req.session.isLoggedIn,
    });
  }
);
