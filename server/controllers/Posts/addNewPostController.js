import * as db from "../../models/db.js";

export default async function addNewPostController(req, res) {
  try {
    const user = req?.user;
    if (!user) {
      return res.sendStatus(401);
    }
    const { caption } = req.body;
    const files = req.files;
    const imagesNames = files.map((image) => image.filename);
    const resp = await db.query(
      "insert into posts(caption, images, username) values($1, $2, $3) returning *",
      [caption, imagesNames, user.username]
    );
    res.json(resp.rows[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
}
