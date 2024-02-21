import * as db from "../../models/db.js";
import { fileURLToPath } from "url";
import path from "path";
import { url } from "inspector";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function deletePostController(req, res) {
  try {
    const user = req?.user;
    if (!user) {
      return res.sendStatus(401);
    }
    const { id } = req.body;

    if (!id) return res.sendStatus(400);

    let resp = await db.query(
      "select username, images from posts where id = $1",
      [id]
    );
    const Post = resp.rows[0];
    if (!Post) return res.sendStatus(404);

    if (Post.username !== user.username) return res.sendStatus(401);

    resp = await db.query("delete from posts where id = $1 returning *", [id]);
    Post.images.forEach(async (image) => {
      const imagePath = path.join(__dirname, "../../storage/PostImages", image);
      await fs.unlink(imagePath, () => {
        console.log("deleted");
      });
    });
    res.json(resp.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
