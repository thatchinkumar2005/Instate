import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//Public routes
app.use("/api/v1/auth/", authRoutes);

//Secured Routes

app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(
    `Server up and running in port ${process.env.SERVER_PORT || 3000}`
  );
});
