import dotenv from "dotenv";
dotenv.config();
import * as db from "../../models/db.js";
import jwt from "jsonwebtoken";
import { settings } from "../../config/settings.js";

export default async function refreshController(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    let resp = await db.query("select * from users where refreshtoken = $1", [
      refreshToken,
    ]);

    const user = resp.rows[0];
    if (!user) return res.sendStatus(401);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const newAccessToken = jwt.sign(
          { username: user.username },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: settings.accessTokenExpiry,
          }
        );
        res.json({ username: user.username, accessToken: newAccessToken });
      }
    );
  } catch (error) {}
}
