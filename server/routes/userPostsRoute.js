import { Router } from "express";
import getAuthUserPosts from "../controllers/Posts/getAuthUserPosts.js";
import multer from "multer";
import { v4 as uuid } from "uuid";
import addNewPostController from "../controllers/Posts/addNewPostController.js";
import { fileURLToPath } from "url";
import path from "path";
import { updatePostController } from "../controllers/Posts/updatePostController.js";
import deletePostController from "../controllers/Posts/deletePostController.js";
import likeController from "../controllers/Posts/likeController.js";
import getUserPosts from "../controllers/Posts/getUserPosts.js";
import verifyJwt from "../middlewares/verifyJwt.js";
import acknowledgeJwt from "../middlewares/acknowledgeJwt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, path.join(__dirname, "../storage/PostImages"));
  },
  filename: (req, file, done) => {
    done(null, file.fieldname + uuid() + path.extname(file.originalname));
  },
});

const uploadPosts = multer({ storage });

const userPostRouter = Router();

userPostRouter.get("/", verifyJwt, getAuthUserPosts);
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
userPostRouter.get("/like", verifyJwt, likeController);
export default userPostRouter;
