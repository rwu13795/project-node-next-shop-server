import express from "express";

import { addToCart } from "./controllers";

const router = express.Router();

router.post("/add-to-cart", addToCart);

router.post("/remove-from-cart");

router.post("/create-order");

export { router as shopRouter };
