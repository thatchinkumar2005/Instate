import * as db from "../../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function authController(req, res) {
  try {
    const { username, pswd } = req.body;

    if (!username || !pswd) {
      return res.sendStatus(400); //bad request
    }

    let resp = await db.query("select * from users where username = $1", [
      username,
    ]);

    const user = resp.rows[0];

    if (!user) {
      return res.sendStatus(404); //username not found
    }

    if (!user.verified) {
      return res.sendStatus(412); //precondition required
    }

    const match = await bcrypt.compare(pswd, user.pswd);

    if (match) {
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2m" }
      );
      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ username: user.username, accessToken });
    } else {
      return res.sendStatus(401); //unauthorized
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); //server error
  }
}
