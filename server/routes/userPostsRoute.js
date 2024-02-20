import { Router } from "express";
import getAllUserPosts from "../controllers/Posts/getAllUserPosts.js";
import multer from "multer";
import addNewPostController from "../controllers/Posts/addNewPostController.js";
import { fileURLToPath } from "url";
import path from "path";
import { updatePostController } from "../controllers/Posts/updatePostController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, path.join(__dirname, "../storage/PostImages"));
  },
  filename: (req, file, done) => {
    done(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const uploadPosts = multer({ storage });

const userPostRouter = Router();

userPostRouter.get("/", getAllUserPosts);
userPostRouter.post(
  "/",
  uploadPosts.array("PostImages", 10),
  addNewPostController
);
userPostRouter.put(
  "/",
  uploadPosts.array("PostImages", 10),
  updatePostController
);

export default userPostRouter;
