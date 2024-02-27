import * as db from "../../models/db.js";

export default async function getAuthUser(req, res) {
  try {
    const user = req.user;
    if (!user) return res.sendStatus(401);

    const resp = await db.query(
      "select fname, lname, username, email, bio, dob, follows, followers from users where username = $1",
      [user.username]
    );

    res.json(resp.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
