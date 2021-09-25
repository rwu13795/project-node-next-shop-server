import { Request, Response, NextFunction } from "express";

export interface CurrentUser {
  username: string;
  email?: string;
  userId?: string;
  cart?: [
    { imageUrl: string; productId: string; quantity: number; price: number }
  ];
}

export const getAuthStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.currentUser) {
    // "req.session.id" is the MongoDB id created when the "session-store"
    // saved the current session to the DB
    req.session.currentUser = {
      username: `guest__${req.session.id}`,
    };
    req.session.isLoggedIn = false;
  }

  console.log(
    "checking currentUser ---->",
    req.session.currentUser,
    req.session.isLoggedIn
  );

  res.status(200).send({
    currentUser: req.session.currentUser,
    isLoggedIn: req.session.isLoggedIn,
  });
};
