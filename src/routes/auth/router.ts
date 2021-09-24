import express from "express";

import { body_signIn, body_signUp, requestValidator } from "../../middlewares";
import { getAuthStatus, signIn, signOut, signUp } from "./controllers";

const router = express.Router();

router.get("/auth-status", getAuthStatus);

router.post("/sign-in", body_signIn, requestValidator, signIn);

router.post("/sign-out", signOut);

router.post("/sign-up", body_signUp, requestValidator, signUp);

router.post("/reset-request");

router.post("/reset-pw");

router.post("/reset-ckeck-token");

export { router as authRouter };
