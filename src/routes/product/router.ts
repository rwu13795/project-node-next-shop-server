import express from "express";
import { createSession } from "../../middlewares";

import { getMainCat, getSubCat, getDetail, updateStock } from "./controllers";

const router = express.Router();

// router.get("/", getMainCat);

// this route must be in front of the "/:main_cat/:sub_cat", since /:main_cat will
// try to match any thing
router.get("/detail/:productId", createSession, getDetail);

router.get("/:main_cat", getMainCat);

router.get("/:main_cat/:sub_cat", getSubCat);

router.put("/update-stock", createSession, updateStock);

export { router as productRouter };
