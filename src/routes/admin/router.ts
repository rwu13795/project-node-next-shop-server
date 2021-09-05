import express from "express";

import { getOneProduct, postNewItem } from "./controllers";

const router = express.Router();

router.post("/post-new-product", postNewItem);

router.post("/get-one-product", getOneProduct);

export { router as adminRouter };
