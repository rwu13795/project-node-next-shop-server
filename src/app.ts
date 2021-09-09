import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { adminRouter } from "./routes/admin/router";
import { productRouter } from "./routes/product/router";
import { errorHandler } from "./middlewares/error-handler/error-handler";

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
app.use("/api/products", productRouter);
app.use("/api/admin", adminRouter);

// YOU HAVE TO APPLY THE errorHandler AT LAST //
app.use(errorHandler);

export { app };
