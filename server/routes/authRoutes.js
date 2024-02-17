import { Router } from "express";
import authController from "../controllers/Auth/authController.js";
import registerController from "../controllers/Auth/registerController.js";
import verifyController from "../controllers/Auth/verifyController.js";

const router = Router();

router.post("/login", authController);
router.post("/register", registerController);
router.get("/verify/:token", verifyController);

export default router;
