import { Router } from "express";
import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import followController from "../controllers/users/followController.js";
import getUserInfo from "../controllers/users/getUserInfo.js";
import verifyJwt from "../middlewares/verifyJwt.js";
import getAuthUser from "../controllers/users/getAuthUser.js";
import acknowledgeJwt from "../middlewares/acknowledgeJwt.js";
import updateUserProfileController from "../controllers/users/updateUserProfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();

const uploadProfilePic = multer({
  storage,
  fileFilter: (req, file, done) => {
    if (file.mimetype.split("/")[0] === "image") {
      done(null, true);
    } else {
      done(new Error("Only Images are allowed"));
    }
  },
});

const userRouter = Router();

userRouter.get("/:username", acknowledgeJwt, getUserInfo);
userRouter.get("/", acknowledgeJwt, getAuthUser);

userRouter.put(
  "/",
  verifyJwt,
  uploadProfilePic.single("ProfilePic"),
  updateUserProfileController
);
userRouter.post("/follow", verifyJwt, followController);

export { userRouter };
