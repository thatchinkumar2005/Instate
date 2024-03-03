import * as db from "../../models/db.js";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";
import path from "path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function updateUserProfileController(req, res) {
  try {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    let verified = true;

    const { fname, lname, email, bio } = req.body;
    const file = req?.file;
    const profilePic =
      file && file.fieldname + uuid() + path.extname(file.originalname);

    console.log(profilePic);

    let resp = await db.query(
      "select fname, lname, email, bio, profilepicture from users where username = $1",
      [user.username]
    );

    const {
      fname: oldFname,
      lname: oldLname,
      email: oldEmail,
      bio: oldBio,
      profilepicture: oldProfilePic,
    } = resp.rows[0];

    if (email) verified = false;

    if (profilePic && oldProfilePic) {
      const imagePath = path.join(
        __dirname,
        "../../storage/ProfileImages",
        oldProfilePic
      );
      console.log(oldProfilePic);
      await fs.unlink(imagePath, () => {
        console.log("deleted " + oldProfilePic);
      });
    }

    if (profilePic) {
      await sharp(file.buffer)
        .resize(320, 320)
        .toFile(
          path.join(__dirname, "../../storage/ProfileImages", profilePic)
        );
    }

    resp = await db.query(
      "update users set fname = $1, lname = $2, email = $3, verified = $4, profilepicture = $5, bio = $6 where username = $7 returning fname, lname, email, bio, verified, profilepicture ",
      [
        fname || oldFname,
        lname || oldLname,
        email || oldEmail,
        verified,
        profilePic || oldProfilePic,
        bio || oldBio,
        user.username,
      ]
    );

    res.json(resp.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
