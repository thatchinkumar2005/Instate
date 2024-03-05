import dotenv from "dotenv";
dotenv.config();
import * as db from "../../models/db.js";
import jwt from "jsonwebtoken";
import { sendResetPasswordMail } from "../../helpers/sendMail.js";
export default async function forgotPasswordController(req, res) {
  try {
    const user = req.user;
    if (!user) return res.sendStatus(401);
    console.log(user);

    let resp = await db.query(
      "select email, pswd from users where username = $1",
      [user.username]
    );

    const { email, pswd } = resp.rows[0];

    const token = jwt.sign(
      { username: user.username },
      process.env.RESET_TOKEN_SECRET + pswd,
      { expiresIn: "1h" }
    );

    const mailResp = await sendResetPasswordMail(token, email);
    console.log(mailResp);
    res.json(mailResp.envelope);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}
