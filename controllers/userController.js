const {
  generateSession,
  getQuotes,
  placeOrder,
} = require("../config/kiteConnect");
const moment = require("moment");
const sql = require("../models/sqlConnection");
require("dotenv").config();

let watchListData = [];

exports.home = (req, res) => {
  // console.log("resresresres", res);
  const user = {};
  return res.render("login", { user });
};

exports.user = async (req, res) => {
  try {
    const user = { name: "Narayan1", email: "narayan@gmail1.com" };
    const reqtoken = req.query.request_token;
    const access_token = await generateSession(reqtoken);
    res.cookie("access_token", reqtoken);
    console.log({ access_token });
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
  return res.render("setting");
};
