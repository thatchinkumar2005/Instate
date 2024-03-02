import * as db from "../../models/db.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function updatePostController(req, res) {
  try {
    const user = req?.user;
    if (!user) return res.sendStatus(401);

    const files = req.files;
    const imagesNames = files.map((image) => image.filename);
    const { caption, id } = req.body;
    if (!id) return res.sendStatus(400);

    let resp = await db.query(
      "select username, images, caption from posts where id = $1",
      [id]
    );

    const { username, images: oldImages, caption: oldCaption } = resp.rows[0];

    if (username !== user.username) return res.sendStatus(401);

    if (imagesNames.length > 0 && oldImages.length > 0) {
      oldImages.forEach(async (image) => {
        const imagePath = path.join(
          __dirname,
          "../../storage/PostImages",
          image
        );
        await fs.unlink(imagePath, () => {
          console.log("deleted " + image);
        });
      });
    }

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
