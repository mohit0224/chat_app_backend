import { Router } from "express";
import {
    createAccount,
    getAllUser,
    getUser,
    loginAccount,
    logoutAccount,
} from "../controllers/user.controllers.js";

import limiter from "../middlewares/rateLimiter.middleware.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";

const router = Router();

router.post("/", createAccount);
router.post("/login", limiter(), loginAccount);
router.post("/logout", isLoggedIn, logoutAccount);

router.get("/", isLoggedIn, getUser);
router.get("/get-all-users", isLoggedIn, getAllUser);

export default router;
