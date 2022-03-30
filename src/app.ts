import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { adminRouter } from "./routes/admin/router";
import { productRouter } from "./routes/product/router";
import { shopRouter } from "./routes/shop/router";
import { authRouter } from "./routes/auth/router";

import { errorHandler } from "./middlewares/error-handler/error-handler";
import { CurrentUser } from "./routes/auth/controllers/user-status";
import { AdminUser } from "./routes/admin/controllers/admin-status";
import { createSession } from "./middlewares";
import Tokens from "csrf";
import { homeIndex } from "./routes";
import { testCloudFront } from "./routes/test-cloud-front";

declare module "express-session" {
  interface SessionData {
    currentUser: CurrentUser;
    adminUser?: AdminUser;
    csrf_secret_user?: string;
    csrf_secret_admin?: string;
  }
}

const app = express();
export const tokens = new Tokens();

app.use(express.json());

app.set("trust proxy", 1);
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://www.node-next-shop-rw.store"],
  })
);

app.use(helmet());
app.use(compression());

// connect all routers to the app
app.get("/", homeIndex);
app.use("/api/products", productRouter);
app.use("/api/admin", createSession, adminRouter);
app.use("/api/shop", createSession, shopRouter);

// only apply the session middleware to the auth route, let redux to get the session
// from the server, so that I could use "getStaticProps" to fetch date without creating
// duplicated session for the same user over and over
app.use("/api/auth", createSession, authRouter);

// test the cloudFront signed cookies
app.get("/api/testing-cloud-front", testCloudFront);

// YOU HAVE TO APPLY THE errorHandler AT LAST //
app.use(errorHandler);

export { app };
