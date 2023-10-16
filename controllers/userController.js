const {
  generateSession,
  getQuotes,
  placeOrder,
} = require("../config/kiteConnect");
const moment = require("moment");
const sql = require("../models/sqlConnection");
const { LOT_QUANTITY } = require("../utils/constant");
const nodemailer = require("nodemailer");
require("dotenv").config();

let watchListData = [];

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "dev.galitein@gmail.com",
    pass: "hkjcluxahlgmoyiu",
  },
});

exports.home = (req, res) => {
  // console.log("resresresres", res);
  const user = {};
  return res.render("login", { user, API_KEY: process.env.API_KEY });
};

exports.user = async (req, res) => {
  try {
    const user = { name: "Narayan1", email: "narayan@gmail1.com" };
    const reqtoken = req.query.request_token;
    const access_token = await generateSession(reqtoken);
    res.cookie("access_token", reqtoken);
    console.log({ access_token });

    if (access_token) {
      const mailOptions = {
        from: "dev.galitein@gmail.com", // Sender's email address
        to: "dhokiyapayal3@gmail.com",
        cc: "ravi@nexuslinkservices.com", // Recipient's email address
        subject: "You've successfully logged in to Algotrading app!", // Email subject
        // text: "This is a test email sent from Node.js.", // Email text
        html: `<!DOCTYPE html>
    <html>

    <head>
        <style>
            /* Inline CSS styles for the email template */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                text-align: center;
            }

            .header {
                background-color: grey;
                color: #;
                padding: 20px;
                font-size: 24px;
            }

            .content {
                padding: 20px;
                font-size: 18px;
            }

            .button {
                background-color: #3498db;
                color: white;;
                text-decoration: none;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
            }

            .button:hover {
                background-color: #2980b9;
            }
        </style>
    </head>

    <body>
        <div class="header">
            <p>Hello there!</p>
        </div>
        <div class="content">
            <p>You've successfully logged in to <b>Algotrading App</b></p>
        </div>
    </body>

    </html>`,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }

    return res.render("user", { user, access_token });
  } catch (err) {
    if (err.error_type == "TokenException") {
      return res.redirect("/");
    }
  }
};
exports.setting = async (req, res) => {
  // try {
  // const user = { name: "dev", email: "dev@gmail.com" };
  // const reqtoken = req.query.request_token;
  // console.log(
  //   "req.query.request_token req.query.request_token",
  //   req.query.request_token
  // );
  // res.cookie("access_token", reqtoken);
  // // var cookie = parseCookie.parseCookie(req.headers.cookie);

  // const access_token = await generateSession(reqtoken);

  // console.log({ access_token });
  //   return res.render("setting");
  // } catch (err) {
  //   if (err.error_type == "TokenException") {
  //     return res.redirect("/");
  //   }
  // }
  // const user = {};
  // res.render("login", { user });
  // res.local.lotSize = LOT_QUANTITY;
  return res.render("setting", {
    lotSize: LOT_QUANTITY,
  });
};
