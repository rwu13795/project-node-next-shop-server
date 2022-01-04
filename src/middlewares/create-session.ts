import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "dotenv";
// import { app } from "../app";

if (process.env.NODE_ENV !== "production") {
  config();
}

// let cookie: CookieOptions = { maxAge: 1000 * 60 * 60, secure: true };

// if (app.get("env") === "production") {
//   cookie.secure = true;
//   cookie.httpOnly = true;
//   cookie.sameSite = "none";
// }

export const createSession = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  // the MongoDBStore will set the expiration time the same as we set for the session
  // by using the expiration function offered by MongoDB
  proxy: true,
  cookie: {
    maxAge: 1000 * 60 * 60,
    // secure: true,
    path: "/",
    sameSite: "none",
    httpOnly: false,
  },
  // store: sessionStore, // additional config for using the MongoDBstore
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
});
