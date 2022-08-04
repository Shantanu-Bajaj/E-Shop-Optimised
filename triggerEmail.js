import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

var transporter = nodemailer.createTransport({
    host: process.env.mailhost,
    port: process.env.mailport,
    auth: {
      user: process.env.mailuser,
      pass: process.env.mailpass
    }
  });
  
  export default transporter;