import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export default function verifyJwt(req, res, next) {
  const authorizationHeader =
    req.headers?.authorization || req.headers?.Authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) return res.sendStatus(403);

  const accessToken = authorizationHeader.split(" ")[1];

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
}
