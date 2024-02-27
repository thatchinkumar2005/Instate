import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export default function acknowledgeJwt(req, res, next) {
  try {
    const authorizationHeader =
      req.headers?.authorization || req.headers?.Authorization;
    if (!authorizationHeader?.startsWith("Bearer")) return next();
    const accessToken = authorizationHeader.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return next();
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.sendStatus({ message: error.message });
  }
}
