import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/message.controllers.js";
import isLoggedIn from "../middlewares/isLoggedIn.middleware.js";

const router = Router();

router.post("/:id", isLoggedIn, sendMessage);
router.get("/:id", isLoggedIn, getMessage);

export default router;
