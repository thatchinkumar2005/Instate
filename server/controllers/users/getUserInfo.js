import * as db from "../../models/db.js";

export default async function getUserInfo(req, res) {
  try {
    let { username } = req.params;
    const user = req.user;

    const resp = await db.query(
      "select fname, lname, username, email, bio, dob, follows, followers from users where username = $1",
      [username]
    );

    res.json(resp.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
