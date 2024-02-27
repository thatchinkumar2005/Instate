import { Router } from "express";
import followController from "../controllers/users/followController.js";

const userRouter = Router();

userRouter.post("/follow", followController);

export { userRouter };
