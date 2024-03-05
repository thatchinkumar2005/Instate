import * as db from "../../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { settings } from "../../config/settings.js";
import ms from "ms";

export default async function authController(req, res) {
  try {
    const { username_email, pswd } = req.body;

    if (!username_email || !pswd) {
      return res.sendStatus(400); //bad request
    }

    let resp = await db.query(
      "select * from users where username = $1 or email = $1",
      [username_email]
    );

    const user = resp.rows[0];

    if (!user) {
      return res.sendStatus(404); //username not found
    }

    if (settings.requireVerification && !user.verified) {
      return res.sendStatus(412); //precondition required
    }

    const match = await bcrypt.compare(pswd, user.pswd);

    if (match) {
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: settings.accessTokenExpiry }
      );
      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: settings.refreshTokenExpiry }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms(settings.refreshTokenExpiry),
      });

      await db.query("update users set refreshtoken = $1 where username = $2", [
        refreshToken,
        user.username,
      ]);

      res.json({ username: user.username, accessToken });
    } else {
      return res.sendStatus(401); //unauthorized
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); //server error
  }
}
