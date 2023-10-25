const sql = require("../models/sqlConnection");
const db = require("../models/index");
const { getQuotes } = require("../config/kiteConnect");
const moment = require("moment");
const fs = require("fs");
const watchListModel = db.watchList;
const watchLists_backup = db.watchLists_backup;
const path = require("path");
const getOrdersLegs = async () => {
  return new Promise((resolve, reject) => {
    sql.query(
      `SELECT DISTINCT legs.*,setting.total_quantity,setting.entry_time,setting.order_type,setting.exit_time,setting.auto_repeat,setting.allow_order FROM legs LEFT JOIN orders on legs.id=orders.leg_id LEFT JOIN setting ON legs.setting_id=setting.id WHERE legs.active_leg=0 AND orders.created_at != '${moment().format(
        "YYYY-MM-DD"
      )}' OR orders.id IS NULL OR (orders.exit_date_time IS NOT NULL AND setting.auto_repeat=1)
      `,
      (err, res) => {
        if (err) {
          reject(0);
        } else {
          resolve(res);
        }
      }
    );
  });
};

const getNiftyPrice = async () => {
  code = ["NSE:NIFTY BANK"];
  if (code) {
    const quotes = await getQuotes(code);
    console.log("codecodecodecodecodecodecode---->>>>", quotes);
    return quotes?.["NSE:NIFTY BANK"]?.last_price;
  }
};
const getdays = (date) => {
  let year = date.getFullYear().toString().substr(-2);
  let day = date.getDate();
  day = day < 10 ? "0" + day : day;
  let month = date.getMonth() + 1;
  return { day, year, month };
};

const getThursdayDate = () => {
  const currentDate = new Date();

  // Get the last day of the current month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Calculate the last Thursday date of the current month
  const lastThursday = new Date(lastDayOfMonth);
  lastThursday.setDate(
    lastThursday.getDate() - ((lastDayOfMonth.getDay() + 7 - 4) % 7)
  );

  // Calculate the second last Thursday date of the current month
  const secondLastThursday = new Date(lastThursday);
  secondLastThursday.setDate(secondLastThursday.getDate() - 7);

  // Check if the current date falls between the two dates
  const isBetween =
    currentDate >= secondLastThursday && currentDate <= lastThursday;

  return isBetween;
};

const createLogFile = (statusCode, message) => {
  const date = new Date();
  const day = date.getDate();
  const year = 2023;
  const month = date.getMonth();
  // console.log(date, day, year, month);

  // const template = `${date}: \n ${statusCode} \n ${message}`;
  fs.appendFile(
    `${path.resolve(
      __dirname,
      "..",
      "logs"
    )}/orders_${day}_${month}_${year}.txt`,
    `\n ${date}: ${statusCode} \n ${message} \n `,
    function (err) {
      if (err) throw err;
      console.log("Saved!");
    }
  );
};

module.exports = {
  getOrdersLegs,
  getNiftyPrice,
  getdays,
  getThursdayDate,
  createLogFile,
};
