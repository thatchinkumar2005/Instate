import dotenv from "dotenv";
dotenv.config();
import * as db from "../../models/db.js";
import jwt from "jsonwebtoken";
import { sendResetPasswordMail } from "../../helpers/sendMail.js";
export default async function forgotPasswordController(req, res) {
  try {
    const { email_username } = req.body;
    let resp = await db.query(
      "select username, email, pswd from users where username = $1 or email = $1",
      [email_username]
    );

    const user = resp.rows[0];
    if (!user) {
      return res.sendStatus(404);
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.RESET_TOKEN_SECRET + user.pswd,
      { expiresIn: "1h" }
    );

    const mailResp = await sendResetPasswordMail(token, user.email);
    console.log(mailResp);
    res.json(mailResp.envelope);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}
