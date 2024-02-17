import * as db from "../../models/db.js";

export default async function logoutController(req, res) {
  //Clear accessToken in the Frontend
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(204);

  const refreshToken = cookie.jwt;
  let resp = await db.query("select * from users where refreshtoken = $1", [
    refreshToken,
  ]);

  const user = resp.rows[0];

  if (!user) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(204);
  }

  await db.query("update users set refreshToken = '' where username = $1", [
    user.username,
  ]);

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.sendStatus(200);
}
