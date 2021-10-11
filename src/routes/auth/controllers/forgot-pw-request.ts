import { NextFunction, Request, Response } from "express";
import { randomBytes } from "crypto";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { transporter } from "../router";
import { User } from "../../../models/user/user-schema";
import { UserDoc } from "../../../models/user/user-interfaces";

export const forgotPassword_Request = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = randomBytes(32).toString("hex");

    const existingUser: UserDoc = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return next(
        new Bad_Request_Error(
          "The email you provided does not exist in our database",
          "email"
        )
      );
    }

    existingUser.resetToken = token;
    existingUser.resetTokenExpiration = Date.now() + 1000 * 60 * 2 + 4000; // 5 mins + 4 sec
    await existingUser.save();

    transporter.sendMail({
      from: "rwu13795.work@gmail.com",
      to: existingUser.email,
      subject: "Link to reset your password",
      html: `<p>You requested a password reset</P>
        <p>Click this <a href="http://localhost:3000/auth/reset-password/${token}"><strong>link</strong></a> to set a new password</P>
        <p>This link will be expired in 5 minutes</P>`,
    });

    console.log("Email sent to " + existingUser.email);

    res.status(201).send();
  }
);
