import express from "express";

import { getProducts, getProductDetail } from "./controllers";

const router = express.Router();

router.get("/", getProducts);

router.get("/:category", getProducts);

router.get("/:category/:sub_category", getProducts);

router.get("/detail/:productId", getProductDetail);

export { router as productRouter };
