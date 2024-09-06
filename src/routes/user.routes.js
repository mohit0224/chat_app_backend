import { Router } from "express";
import { createAccount, getUser } from "../controllers/user.controllers.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";

const router = Router();

router.get("/create", createAccount);

router.get("/", isLoggedIn, getUser);

export default router;
