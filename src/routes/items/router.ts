import express from "express";

import { getAllMenItems, getAllWomenItems } from "./controllers";

const router = express.Router();

router.get("/men", getAllMenItems);

router.get("/women", getAllWomenItems);

export { router as itemsRouter };
