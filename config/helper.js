const sql = require("../models/sqlConnection");
const db = require("../models/index");
const { getQuotes } = require("../config/kiteConnect");
const moment = require("moment");
const watchListModel = db.watchList;
const watchLists_backup = db.watchLists_backup;
const getOrdersLegs = async () => {
  return new Promise((resolve, reject) => {
    sql.query(
      `SELECT DISTINCT legs.*,setting.entry_time,setting.order_type,setting.exit_time,setting.auto_repeat,setting.allow_order FROM legs LEFT JOIN orders on legs.id=orders.leg_id LEFT JOIN setting ON legs.setting_id=setting.id WHERE orders.created_at != '${moment().format(
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
module.exports = {
  getOrdersLegs,
  getNiftyPrice,
  getdays,
};
