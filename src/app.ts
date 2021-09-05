import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

// import { Payment } from "./models/payments";
// import { runAsync } from "./middlewares/async-wrapper";
// import { createStripeCheckoutSession } from "./middlewares/checkout";
// import { createPaymentIntent } from "./middlewares/payment-intent";
// import { handleStripeWebhook } from "./middlewares/webhooks";

import { adminRouter, itemsRouter } from "./routes";

const app = express();

// app.use(express.json());
// Use JSON parser for all non-webhook routes
// parse all other routes to JSON, leave the /webhook route as rawBody
app.use((req: Request, res: Response, next: NextFunction): void => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(
  cors({
    origin: [
      "https://project-next-js-blog.vercel.app",
      "http://localhost:3000",
    ],
  })
);

app.use(helmet());
app.use(compression());

// connect all routers to the app
app.use("/api", itemsRouter);
app.use("/api/admin", adminRouter);

export { app };
