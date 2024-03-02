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

const storage = multer.diskStorage({
  destination: (req, file, done) => {
    done(null, path.join(__dirname, "../storage/ProfileImages"));
  },

  filename: (req, file, done) => {
    const fileName = file.fieldname + uuid() + path.extname(file.originalname);
    done(null, fileName);
  },
});

const uploadProfilePic = multer({ storage });

const userRouter = Router();

userRouter.get("/:username", acknowledgeJwt, getUserInfo);
userRouter.get("/", verifyJwt, getAuthUser);

userRouter.post(
  "/",
  verifyJwt,
  uploadProfilePic.single("ProfilePic"),
  updateUserProfileController
);
userRouter.post("/follow", verifyJwt, followController);

export { userRouter };
