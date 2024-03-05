import { Router } from "express";
import getAuthUserPosts from "../controllers/Posts/getAuthUserPosts.js";
import multer from "multer";
import addNewPostController from "../controllers/Posts/addNewPostController.js";
import { updatePostController } from "../controllers/Posts/updatePostController.js";
import deletePostController from "../controllers/Posts/deletePostController.js";
import likeController from "../controllers/Posts/likeController.js";
import getUserPosts from "../controllers/Posts/getUserPosts.js";
import verifyJwt from "../middlewares/verifyJwt.js";
import acknowledgeJwt from "../middlewares/acknowledgeJwt.js";

const storage = multer.memoryStorage();

const uploadPosts = multer({
  storage,
  fileFilter: (req, file, done) => {
    if (file.mimetype.split("/")[0] === "image") {
      done(null, true);
    } else {
      done(new Error("Only Images"));
    }
  },
});

const userPostRouter = Router();

userPostRouter.get("/", acknowledgeJwt, getAuthUserPosts);
userPostRouter.get("/:username", acknowledgeJwt, getUserPosts);
userPostRouter.post(
  "/",
  verifyJwt,
  uploadPosts.array("PostImages", 10),
  addNewPostController
);
userPostRouter.put(
  "/",
  verifyJwt,
  uploadPosts.array("PostImages", 10),
  updatePostController
);
userPostRouter.delete("/", verifyJwt, deletePostController);
userPostRouter.post("/like", verifyJwt, likeController);
export default userPostRouter;
