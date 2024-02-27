import * as db from "../../models/db.js";

export default async function getUserPosts(req, res) {
  try {
    const { username } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const resp = await db.query(
      "select * from posts where username = $1 limit $2 offset $3",
      [username, limit, limit * (page - 1)]
    );

    res.json(resp.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
