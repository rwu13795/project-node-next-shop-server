import { NextFunction, Request, Response } from "express";

import { asyncWrapper, Bad_Request_Error } from "../../../middlewares";
import { User } from "../../../models/user/user-schema";
import { Password } from "../../../utils/hash-password";

export const signIn = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("in sign in");

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return next(new Bad_Request_Error("This email does not exist", "email"));
    }

    const checkPassword = await Password.compare(
      existingUser.password,
      password
    );
    if (!checkPassword) {
      return next(new Bad_Request_Error("Password is incorrect", "password"));
    }

    // after the user is signed in successfully, put the user info inside the
    // DB, so that we can use the info to find the user-DB-instance

    req.session.currentUser = {
      username: existingUser.firstName,
      email: existingUser.email,
      userId: existingUser.id,
      //   cart: req.session.currentUser.cart,
    };
    req.session.isLoggedIn = true;

    res.status(200).send({
      message: "Logged in",
      currentUser: req.session.currentUser,
      isLoggedIn: req.session.isLoggedIn,
    });
  }
);