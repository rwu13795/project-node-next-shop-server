import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config();
}

export const createSession = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  // the MongoDBStore will set the expiration time the same as we set for the session
  // by using the expiration function offered by MongoDB
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: true,
    domain: "https://node-next-shop-client.herokuapp.com",
  }, // 1 hour
  // store: sessionStore, // additional config for using the MongoDBstore
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
});
