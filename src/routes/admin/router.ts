import express from "express";

import { postNewItem } from "./controllers";

const router = express.Router();

router.post("/post-new-item", postNewItem);

export { router as adminRouter };
