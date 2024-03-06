import * as db from "../../models/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { jwtDecode } from "jwt-decode";

export default async function resetPasswordController(req, res) {
  try {
    const { token } = req.params;
    const { username } = jwtDecode(token);
    if (!username) return res.sendStatus(403);

    const { newPswd, confirmPswd } = req.body;

    if (!(newPswd && confirmPswd)) return res.sendStatus(400);
    if (newPswd !== confirmPswd) return res.sendStatus(409);

    let decoded;
    let resp = await db.query("select pswd from users where username = $1", [
      username,
    ]);
    const { pswd: oldPswd } = resp.rows[0];
    if (oldPswd === newPswd) return res.sendStatus(412);
    try {
      decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET + oldPswd);
    } catch (error) {
      return res.sendStatus(403);
    }

    const hash = await bcrypt.hash(newPswd, 10);
    resp = db.query("update users set pswd = $1 where username = $2", [
      hash,
      username,
    ]);

    res.json({ message: "password reset" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
