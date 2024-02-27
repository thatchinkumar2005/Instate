import { Router } from "express";
import followController from "../controllers/users/followController.js";
import getUserInfo from "../controllers/users/getUserInfo.js";
import acknowledgeJwt from "../middlewares/acknowledgeJwt.js";
import verifyJwt from "../middlewares/verifyJwt.js";
import getAuthUser from "../controllers/users/getAuthUser.js";

const userRouter = Router();

userRouter.get("/:username", getUserInfo);
userRouter.get("/", verifyJwt, getAuthUser);
userRouter.post("/follow", verifyJwt, followController);

export { userRouter };
