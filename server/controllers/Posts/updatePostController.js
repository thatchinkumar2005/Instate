import * as db from "../../models/db.js";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";
import path from "path";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function updatePostController(req, res) {
  try {
    const user = req?.user;
    if (!user) return res.sendStatus(401);

    const files = req.files;
    let imagesNames = files.map(
      (image) => image.fieldname + uuid() + path.extname(image.originalname)
    );
    const { caption, id } = req.body;
    if (!id) return res.sendStatus(400);

    let resp = await db.query(
      "select username, images, caption from posts where id = $1",
      [id]
    );

    const { username, images: oldImages, caption: oldCaption } = resp.rows[0];

    if (username !== user.username) return res.sendStatus(401);

    if (imagesNames.length > 0) {
      oldImages.forEach(async (image) => {
        const imagePath = path.join(
          __dirname,
          "../../storage/PostImages/",
          image
        );
        await fs.unlink(imagePath, () => {
          console.log("deleted " + image);
        });
      });
    }

    files.forEach(async (image, i) => {
      await sharp(image.buffer)
        .resize(1080, 1920)
        .toFile(
          path.join(__dirname, "../../storage/PostImages", imagesNames[i])
        );
    });

    resp = await db.query(
      "update posts set caption = $1, images = $2 where id = $3 returning *",
      [
        caption || oldCaption,
        imagesNames.length > 0 ? imagesNames : oldImages,
        id,
      ]
    );
    res.json(resp.rows[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
}
