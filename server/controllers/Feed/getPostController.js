import * as db from "../../models/db.js";

export default async function getPostController(req, res) {
  try {
    const { id } = req.params;
    const resp = await db.query("select * from posts where id = $1", [id]);
    res.json(resp.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
