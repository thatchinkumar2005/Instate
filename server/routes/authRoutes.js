import { Router } from "express";
import authController from "../controllers/Auth/authController.js";
import registerController from "../controllers/Auth/registerController.js";
import verifyController from "../controllers/Auth/verifyController.js";
import refreshController from "../controllers/Auth/refreshController.js";
import logoutController from "../controllers/Auth/logoutController.js";
import forgotPasswordController from "../controllers/Auth/forgotPassword.js";
import resetPasswordController from "../controllers/Auth/resetPasswordController.js";

const authRouter = Router();

authRouter.post("/login", authController);
authRouter.post("/register", registerController);
authRouter.get("/verify/:token", verifyController);
authRouter.get("/refresh", refreshController);
authRouter.get("/logout", logoutController);
authRouter.post("/forgotPassword", forgotPasswordController);
authRouter.post("/resetPassword/:token", resetPasswordController);

export default authRouter;
