import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { jwtDecode } from "jwt-decode";

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

export async function sendVerificationMail(token, to) {
  let mail = Mailgenerator.generate({
    body: {
      name: jwtDecode(token)?.username,
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

export async function sendResetPasswordMail(token, to) {
  let mail = Mailgenerator.generate({
    body: {
      name: jwtDecode(token)?.username,
      intro: "Reset your Instate account password",
      action: {
        instructions: "click the button below to reset the password : ",
        button: {
          color: "#C4DFDF",
          text: "Reset",
          link: `http://localhost:3000/api/v1/users/resetPswd/${token}`,
        },
      },
    },
  });

  try {
    const resp = await transporter.sendMail({
      from: process.env.MAIL,
      to,
      subject: "Reset your Password",
      html: mail,
    });
    console.log(`http://localhost:3000/api/v1/users/resetPswd/${token}`);
    return resp;
  } catch (error) {
    throw new Error(error.message);
  }
}
