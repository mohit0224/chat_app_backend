import { Router } from "express";
import { createAccount, getUser } from "../controllers/user.controllers.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";
import limiter from "../middlewares/rateLimiter.middleware.js";

const router = Router();

router.post("/", limiter, createAccount);

router.get("/", isLoggedIn, getUser);

export default router;
