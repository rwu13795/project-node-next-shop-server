import express from "express";
import { uploadImages } from "../../middlewares/upload-images";

import { getOneProduct, postNewProcut, editProduct } from "./controllers";

const router = express.Router();

router.post("/post-new-product", uploadImages, postNewProcut);

router.post("/get-one-product", getOneProduct);

router.post("/edit-product", uploadImages, editProduct);

export { router as adminRouter };
