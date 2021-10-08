import { NextFunction, Request, Response } from "express";
import { CartItem } from ".";
// import nodemailer from "nodemailer";
// import nodemailerSendgrid from "nodemailer-sendgrid";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { UserInfo } from "../../../models/user/user-interfaces";
import { User } from "../../../models/user/user-schema";

// const mailTransporter = nodemailer.createTransport(
//   nodemailerSendgrid({
//     apiKey: process.env.SENDGRID_API_KEY,
//   })
// );

interface SignUpBody {
  email: string;
  password: string;
  userInfo: UserInfo;
}

export const signUp = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, userInfo }: SignUpBody = req.body;

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
      email,
      password,
      userInfo,
      cartDetail: {
        cart: req.session.currentUser.cart,
        expireAt: Date.now() + 1000 * 60 * 5,
      },
    });

    await newUser.save();

    req.session.currentUser = {
      username: newUser.userInfo.first_name,
      cart: newUser.cartDetail.cart,
      email: newUser.email,
      userId: newUser.id,
      userInfo: newUser.userInfo,
      isLoggedIn: true,
    };

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
    });
  }
);
