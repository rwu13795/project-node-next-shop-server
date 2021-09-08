import express from "express";
import { uploadImages } from "../../middlewares/upload-images";

import { getOneProduct, postNewItem, editProduct } from "./controllers";

const router = express.Router();

router.post("/post-new-product", postNewItem);

router.post("/get-one-product", getOneProduct);

router.post("/edit-product", uploadImages, editProduct);

export { router as adminRouter };
