import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config();
}

export const adminSession = session({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 30 }, // 30 mins
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "admin_sessions",
  }),
});
