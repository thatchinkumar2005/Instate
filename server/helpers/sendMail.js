import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import jwt from "jsonwebtoken";

const config = {
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PSWD,
  },
};

let Mailgenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Instate",
    link: "http:localhost:4000",
  },
});

let transporter = nodemailer.createTransport(config);

export async function sendVerificationMail(username, to) {
  let token = jwt.sign({ username }, process.env.MAIL_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  let mail = Mailgenerator.generate({
    body: {
      name: username,
      intro: "Verify Your Instate Account",
      action: {
        instructions: "click the button below to verify your account : ",
        button: {
          color: "#C4DFDF",
          text: "Verify",
          link: `http://localhost:3000/api/v1/auth/verify/${token}`,
        },
      },
    },
  });

  try {
    const resp = await transporter.sendMail({
      from: process.env.MAIL,
      to,
      subject: "Verify Your Instate Account",
      html: mail,
    });
    return resp;
  } catch (error) {
    throw new Error(error.message);
  }
}
