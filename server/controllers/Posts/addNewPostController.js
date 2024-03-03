import * as db from "../../models/db.js";
import { v4 as uuid } from "uuid";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function addNewPostController(req, res) {
  try {
    const user = req?.user;
    if (!user) {
      return res.sendStatus(401);
    }
    const { caption } = req.body;
    const files = req.files;
    let imagesNames = files.map(
      (image) => image.fieldname + uuid() + path.extname(image.originalname)
    );

    files.forEach(async (image, i) => {
      await sharp(image.buffer)
        .resize(1080, 1920)
        .toFile(
          path.join(__dirname, "../../storage/PostImages", imagesNames[i])
        );
    });

    const resp = await db.query(
      "insert into posts(caption, images, username) values($1, $2, $3) returning *",
      [caption, imagesNames, user.username]
    );
    res.json(resp.rows[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
}
