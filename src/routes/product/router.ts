import express from "express";

import { getMainCat, getSubCat, getDetail } from "./controllers";

const router = express.Router();

// router.get("/", getMainCat);

router.get("/:main_cat", getMainCat);

router.get("/:main_cat/:sub_cat", getSubCat);

router.get("/detail/:category/:productId", getDetail);

export { router as productRouter };
