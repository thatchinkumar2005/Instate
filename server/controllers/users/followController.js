import * as db from "../../models/db.js";

export default async function followController(req, res) {
  try {
    const user = req?.user;
    if (!user) return res.sendStatus(401);
    const { username } = req.body;
    let targetUsername = username;
    if (!targetUsername) return res.sendStatus(400);

    if (targetUsername === user.username) return res.sendStatus(409);
    let resp = await db.query(
      "select followers from users where username = $1",
      [targetUsername]
    );
    let targetUserFollowers = resp.rows[0].followers;

    resp = await db.query("select follows from users where username = $1", [
      user.username,
    ]);
    let userFollows = resp.rows[0].follows;

    let index = targetUserFollowers.indexOf(user.username);
    if (index !== -1) {
      targetUserFollowers.splice(index, 1);
      resp = await db.query(
        "update users set followers = $1 where username = $2 returning followers",
        [targetUserFollowers, targetUsername]
      );
      targetUserFollowers = resp.rows[0].followers;

      let index_ = userFollows.indexOf(targetUsername);
      if (index_ !== -1) {
        userFollows.splice(index_, 1);
        resp = await db.query(
          "update users set follows = $1 where username = $2 returning follows",
          [userFollows, user.username]
        );
        userFollows = resp.rows[0].follows;
      }

      return res.json({
        TargetFollowers: targetUserFollowers,
        userFollows,
      });
    }

    targetUserFollowers.push(user.username);
    userFollows.push(targetUsername);

    resp = await db.query(
      "update users set followers = $1 where username = $2 returning followers",
      [targetUserFollowers, targetUsername]
    );
    targetUserFollowers = resp.rows[0].followers;
    resp = await db.query(
      "update users set follows = $1 where username = $2 returning follows",
      [userFollows, user.username]
    );
    userFollows = resp.rows[0].follows;

    res.json({ TargetFollowers: targetUserFollowers, userFollows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
