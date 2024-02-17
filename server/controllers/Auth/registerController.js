import { sendVerificationMail } from "../../helpers/sendMail.js";
import * as db from "../../models/db.js";
import bcrypt from "bcrypt";

export default async function registerController(req, res) {
  try {
    const { username, pswd, email, fname, lname, dob, bio } = req.body;
    if (!username || !pswd || !email || !fname) {
      return res.sendStatus(400); //bad request
    }
    let resp = await db.query(
      "select * from users where username = $1 or email = $2",
      [username, email]
    );

    if (resp.rows.length !== 0) {
      return res.sendStatus(409); //conflict
    }

    const hash = await bcrypt.hash(pswd, 10);

    resp = await db.query(
      "insert into users(username, pswd, email, fname, lname, dob, bio) values($1, $2, $3, $4, $5, $6, $7) returning *",
      [username, hash, email, fname, lname || "", dob, bio || ""]
    );

    const emailResp = await sendVerificationMail(username, email);

    console.log(emailResp);

    res.json(resp.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
