import express from "express";

import { addToCart, changeQuantity } from "./controllers";

const router = express.Router();

router.post("/add-to-cart", addToCart);

router.post("/remove-from-cart");

router.post("/change-quantity", changeQuantity);

router.post("/create-order");

export { router as shopRouter };
