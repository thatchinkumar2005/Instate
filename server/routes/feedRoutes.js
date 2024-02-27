import { Router } from "express";
import feedController from "../controllers/Feed/UserFeedController.js";
import getPostController from "../controllers/Feed/getPostController.js";

const feedRouter = Router();

feedRouter.get("/", feedController);
feedRouter.get("/post/:id", getPostController);

export { feedRouter };
