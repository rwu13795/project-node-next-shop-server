import express from "express";
import { getImagesFromClient } from "../../middlewares/get-images";

import { getOneProduct, postNewProcut, editProduct } from "./controllers";

const router = express.Router();

router.post("/post-new-product", getImagesFromClient, postNewProcut);

router.post("/get-one-product", getOneProduct);

router.post("/edit-product", getImagesFromClient, editProduct);

export { router as adminRouter };
