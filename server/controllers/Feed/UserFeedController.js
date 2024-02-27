import * as db from "../../models/db.js";

export default async function feedController(req, res) {
  try {
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 10;
    const user = req.user;

    let normalFeedPage;

    if (!user) {
      let resp = await db.query(
        "select * from posts order by coalesce(array_length(liked, 1), 0) desc, id desc offset $1 limit $2",
        [limit * (page - 1), limit]
      );
      return res.json(resp.rows);
    }

    let resp = await db.query("select follows from users where username = $1", [
      user.username,
    ]);
    let userFollows = resp.rows[0].follows;
    console.log(userFollows);

    resp = await db.query(
      " select * from posts where username != $4 order by case when username = any($1) then 0 else 1 end, coalesce(array_length(liked, 1), 0) desc, id desc limit $2 offset $3 ",
      [userFollows, limit, limit * (page - 1), user.username]
    ); //fetches posts based

    res.json(resp.rows);
  } catch (error) {
    res.json({ message: error.message });
  }
}
