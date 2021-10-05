import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config();
}

export const userSession = session({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true,
  // the MongoDBStore will set the expiration time the same as we set for the session
  // by using the expiration function offered by MongoDB
  cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  // store: sessionStore, // additional config for using the MongoDBstore
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
});
