import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import jwt from "jsonwebtoken";
import * as db from "../../models/db.js";

export default async function verifyController(req, res) {
  try {
    const { token } = req.params;
    jwt.verify(token, process.env.MAIL_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(401);
      const { username } = decoded;

      const resp = await db.query(
        "update users set verified = true where username = $1 returning email, verified",
        [username]
      );
      res.json(resp.rows[0]);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
