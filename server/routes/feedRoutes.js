import { Router } from "express";
import feedController from "../controllers/Feed/feedController.js";

const feedRouter = Router();

feedRouter.get("/", feedController);

export { feedRouter };
