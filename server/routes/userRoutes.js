import { Router } from "express";
import followController from "../controllers/users/followController.js";

const userRouter = Router();

userRouter.get("/follow", followController);

export { userRouter };
