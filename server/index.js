import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRoutes.js";
import userPostRouter from "./routes/userPostsRoute.js";
import verifyJwt from "./middlewares/verifyJwt.js";

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//Public routes
app.use("/api/v1/auth/", authRouter);

//Secured Routes
app.use("/api/v1/userposts/", verifyJwt, userPostRouter);

app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(
    `Server up and running in port ${process.env.SERVER_PORT || 3000}`
  );
});
