import express, { Request, Response, NextFunction } from "express";
// import { config } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { adminRouter } from "./routes/admin/router";
import { productRouter } from "./routes/product/router";
import { shopRouter } from "./routes/shop/router";
import { authRouter } from "./routes/auth/router";

import { errorHandler } from "./middlewares/error-handler/error-handler";
import { CurrentUser } from "./routes/auth/controllers/auth-status";
import { createSession } from "./middlewares";

declare module "express-session" {
  interface SessionData {
    currentUser: CurrentUser;
    isLoggedIn: boolean;
    csrf_secret: string;
  }
}

// if (process.env.NODE_ENV !== "production") {
//   config();
// }

const app = express();

app.use(express.json());
// Use JSON parser for all non-webhook routes
// parse all other routes to JSON, leave the /webhook route as rawBody
// app.use((req: Request, res: Response, next: NextFunction): void => {
//   if (req.originalUrl === "/webhook") {
//     next();
//   } else {
//     express.json()(req, res, next);
//   }
// });

app.use(
  cors({
    credentials: true,
    origin: [
      "https://project-next-js-blog.vercel.app",
      "http://localhost:3000",
    ],
  })
);

// const sessionStore = new MongoDBStore(
//   {
//     uri: process.env.MONGO_URI,
//     collection: "sessions",
//   },
//   function (error) {
//     console.log(error);
//     // Should have gotten an error
//   }
// );

// app.use(
//   session({
//     secret: "my-secret",
//     resave: true,
//     saveUninitialized: true,
//     // the MongoDBStore will set the expiration time the same as we set for the session
//     // by using the expiration function offered by MongoDB
//     cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
//     // store: sessionStore, // additional config for using the MongoDBstore
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//     }),
//   })
// );

app.use(helmet());
app.use(compression());

// connect all routers to the app
app.use("/api/products", productRouter);
app.use("/api/admin", createSession, adminRouter);
app.use("/api/shop", createSession, shopRouter);

// only apply the session middleware to the auth route, let redux to get the session
// from the server, so that I could use "getStaticProps" to fetch date without creating
// duplicated session for the same user over and over
app.use("/api/auth", createSession, authRouter);

// YOU HAVE TO APPLY THE errorHandler AT LAST //
app.use(errorHandler);

export { app };
