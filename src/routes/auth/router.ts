import express from "express";

import { body_signIn, body_signUp, requestValidator } from "../../middlewares";
import { getAuthStatus } from "./controllers/auth-status";
import { signIn } from "./controllers/sign-in";
import { signUp } from "./controllers/sign-up";

const router = express.Router();

router.get("/auth-status", getAuthStatus);

router.post("/sign-in", body_signIn, requestValidator, signIn);

router.post("/sign-out");

router.post("/sign-up", body_signUp, requestValidator, signUp);

router.post("/reset-request");

router.post("/reset-pw");

router.post("/reset-ckeck-token");

export { router as authRouter };
