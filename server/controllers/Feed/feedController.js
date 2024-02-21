import * as db from "../../models/db.js";

export default async function feedController(req, res) {
  try {
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 3;
    let resp = await db.query(
      "select * from posts order by coalesce(array_length(liked, 1), 0) desc offset $1 limit $2",
      [limit * (page - 1), limit]
    );
    res.json(resp.rows);
  } catch (error) {
    res.json({ message: error.message });
  }
}
