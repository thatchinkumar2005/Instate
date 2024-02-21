import * as db from "../../models/db.js";

export default async function likeController(req, res) {
  try {
    const user = req?.user;
    if (!user) {
      return res.sendStatus(401);
    }
    const { id } = req.body;
    if (!id) return res.sendStatus(400);
    let resp = await db.query("select liked from posts where id = $1", [id]);
    let liked = resp.rows[0].liked;
    if (liked.includes(user.username)) {
      liked.splice(liked.indexOf(user.username), 1);
      resp = await db.query("update posts set liked = $1 returning liked", [
        liked,
      ]);
      return res.json(resp.rows[0].liked);
    }
    liked.push(user.username);
    resp = await db.query("update posts set liked = $1 returning liked", [
      liked,
    ]);
    res.json(resp.rows[0].liked);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
