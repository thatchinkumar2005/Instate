import * as db from "../../models/db.js";

export default async function getAllUserPosts(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.sendStatus(401);
    }
    const page = req.query.page || 1;
    const limit = req.query.limit || 3;

    const resp = await db.query(
      "select * from posts where username = $1 limit $2 offset $3",
      [user.username, limit, limit * (page - 1)]
    );
    res.json(resp.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
