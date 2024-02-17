import { Router } from "express";
import authController from "../controllers/Auth/authController.js";
import registerController from "../controllers/Auth/registerController.js";
import verifyController from "../controllers/Auth/verifyController.js";
import refreshController from "../controllers/Auth/refreshController.js";
import logoutController from "../controllers/Auth/logoutController.js";

const router = Router();

router.post("/login", authController);
router.post("/register", registerController);
router.get("/verify/:token", verifyController);
router.get("/refresh", refreshController);
router.get("/logout", logoutController);

export default router;
