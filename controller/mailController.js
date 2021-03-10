const nodemailer = require("nodemailer");

const { createConfirmToken } = require("../utils/jwt");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendConfirmationEmail = ({ email, userId }) => {
  createConfirmToken({ email, userId }, (err, token) => {
    if (err) {
      console.error(err);
    } else {
      transporter.sendMail({
        from: `App to do <> ${process.env.EMAIL}`,
        to: email,
        subject: "Email confirmation",
        html: `<a href=${process.env.EMAIL_CONFIRMATION_LINK}${token}>Click to confirm</a>`,
      });
    }
  });
};
