const {
  getQuotes,
  placeOrder,
  generateSession,
  getPositions,
  getOrderdata,
} = require("../config/kiteConnect");
const moment = require("moment");
const sql = require("../models/sqlConnection");
const logger = require("../logger");

const { getOrdersLegs, getNiftyPrice } = require("../config/helper");
function getNextDayOfWeek(date, dayOfWeek) {
  var resultDate = new Date(date.getTime());
  resultDate.setDate(date.getDate() + ((7 + dayOfWeek - date.getDay()) % 7));
  return resultDate;
}
result = moment().endOf("month");
while (result.day() !== 4) {
  result.subtract(1, "day");
}
let thurdate = getNextDayOfWeek(new Date(), 4);
let getThurday = moment(thurdate).format("YYMDD");
if (moment(result).format("YYMDD") === getThurday) {
  getThurday = moment(result).format("YYMMM").toUpperCase();
} else {
  getThurday = getThurday;
}
// console.log(
//   "getThurdaygetThurdaygetThurday",
//   getThurday,
//   thurdate,
//   moment(result).format("YYMDD")
// );

exports.addStrategy = async (req, res) => {
  try {
    let isError = false;

    const {
      setting_id,
      exit_bn_profit,
      exit_bn_loss,
      entry_time,
      exit_time,
      auto_repeat = 0,
      s1name,
      s2name,
      s1l1,
      s1l2,
      s2l1,
      s2l2,
      str1_id,
      str2_id,
      leg1_id,
      leg2_id,
      leg3_id,
      leg4_id,
      total_quantity,
      allow_order,
      order_type,
      sl_value,
    } = req.body;
    const leg1 = s1l1.split(" ");
    const leg2 = s1l2.split(" ");
    const leg3 = s2l1.split(" ");
    const leg4 = s2l2.split(" ");
    var r = /\d+/;
    let created_at = moment().format("YYYY-MM-DD HH:mm:ss");
    if (setting_id === "") {
      sql.query(
        `INSERT INTO setting (entry_time,exit_time,auto_repeat,exit_bn_profit,exit_bn_loss,total_quantity,order_type,sl_value,allow_order,created_at) VALUES ('${entry_time}', '${exit_time}', ${auto_repeat}, '${exit_bn_profit}', ${exit_bn_loss}, ${total_quantity}, '${order_type}', ${
          order_type === "MARKET" ? null : sl_value
        }, '${allow_order}', '${created_at}')`,
        async (err, result) => {
          if (!err) {
            if (s1name) {
              sql.query(
                `INSERT INTO strategy (name,created_at) VALUES ('${s1name}','${created_at}')`,
                async (err, resultStr) => {
                  if (!err) {
                    isError = false;
                    if (s1l1) {
                      sql.query(
                        `INSERT INTO legs (strategy_id,setting_id,buy_sell,strike_price,call_put,quantity,created_at) VALUES (${
                          resultStr.insertId
                        }, ${result.insertId}, '${leg1[0]}', '${leg1[1]}', '${
                          leg1[2]
                        }', '${
                          leg1[3].match(r) * 25 * total_quantity
                        }','${created_at}')`,
                        async (err, result) => {
                          if (!err) {
                            isError = false;
                          } else {
                            isError = true;
                            return res
                              .status(400)
                              .json({ status: 0, message: err.message });
                          }
                        }
                      );
                    }
                    if (s1l2) {
                      sql.query(
                        `INSERT INTO legs (strategy_id,setting_id,buy_sell,strike_price,call_put,quantity,created_at) VALUES (${
                          resultStr.insertId
                        }, ${result.insertId}, '${leg2[0]}', '${leg2[1]}', '${
                          leg2[2]
                        }', '${
                          leg2[3].match(r) * 25 * total_quantity
                        }','${created_at}')`,
                        async (err, result) => {
                          if (!err) {
                            isError = false;
                          } else {
                            isError = true;
                            return res
                              .status(400)
                              .json({ status: 0, message: err.message });
                          }
                        }
                      );
                    }
                  } else {
                    isError = true;
                    return res
                      .status(400)
                      .json({ status: 0, message: err.message });
                  }
                }
              );
            }
            if (s2name) {
              sql.query(
                `INSERT INTO strategy (name,created_at) VALUES ('${s2name}','${created_at}')`,
                async (err, resultStr) => {
                  if (!err) {
                    isError = false;
                    if (s2l1) {
                      sql.query(
                        `INSERT INTO legs (strategy_id,setting_id,buy_sell,strike_price,call_put,quantity,created_at) VALUES (${
                          resultStr.insertId
                        }, ${result.insertId}, '${leg3[0]}', '${leg3[1]}', '${
                          leg3[2]
                        }', '${
                          leg3[3].match(r) * 25 * total_quantity
                        }','${created_at}')`,
                        async (err, result) => {
                          if (!err) {
                            isError = false;
                          } else {
                            isError = true;
                            return res
                              .status(400)
                              .json({ status: 0, message: err.message });
                          }
                        }
                      );
                    }
                    if (s2l2) {
                      sql.query(
                        `INSERT INTO legs (strategy_id,setting_id,buy_sell,strike_price,call_put,quantity,created_at) VALUES (${
                          resultStr.insertId
                        }, ${result.insertId}, '${leg4[0]}', '${leg4[1]}', '${
                          leg4[2]
                        }', '${
                          leg4[3].match(r) * 25 * total_quantity
                        }','${created_at}')`,
                        async (err, result) => {
                          if (!err) {
                            isError = false;
                          } else {
                            isError = true;
                            return res
                              .status(400)
                              .json({ status: 0, message: err.message });
                          }
                        }
                      );
                    }
                  } else {
                    isError = true;
                    return res
                      .status(400)
                      .json({ status: 0, message: err.message });
                  }
                }
              );
            }

            if (isError === false) {
              res.redirect("/user");
            }
          } else {
            return res.status(400).json({ status: 0, message: err.message });
          }
        }
      );
    } else {
      sql.query(
        `UPDATE setting SET exit_bn_profit = ${exit_bn_profit},exit_bn_loss=${exit_bn_loss},entry_time="${entry_time}",exit_time="${exit_time}",auto_repeat=${auto_repeat},total_quantity=${total_quantity},order_type="${order_type}",sl_value=${
          order_type === "MARKET" ? null : sl_value
        },allow_order="${allow_order}" WHERE id = ${setting_id}`,
        async (err, result) => {
          var str1;
          var str2;
          if (!err) {
            if (s1name && str1_id) {
              sql.query(
                `UPDATE strategy SET name = "${s1name}" WHERE id = ${str1_id}`,
                async (err, resultStr) => {
                  if (!err) {
                    isError = false;
                    if (s1l1) {
                      sql.query(
                        `UPDATE legs SET strategy_id = ${str1_id},setting_id=${setting_id},buy_sell="${
                          leg1[0]
                        }",strike_price=${leg1[1]},call_put="${
                          leg1[2]
                        }",quantity=${
                          leg1[3].match(r) * 25 * total_quantity
                        } WHERE id = ${leg1_id}`,
                        async (err, result) => {
                          if (!err) {
                            isError = false;
                          } else {
                            isError = true;
                            return res
                              .status(400)
                              .json({ status: 0, message: err.message });
                          }
                        }
                      );
                    }
                    if (s1l2) {
                      sql.query(
                        `UPDATE legs SET strategy_id = ${str1_id},setting_id=${setting_id},buy_sell="${
                          leg2[0]
                        }",strike_price=${leg2[1]},call_put="${
                          leg2[2]
                        }",quantity=${
                          leg2[3].match(r) * 25 * total_quantity
                        } WHERE id = ${leg2_id}`,
                        async (err, result) => {
                          if (!err) {
                            isError = false;
                          } else {
                            isError = true;
                            return res
                              .status(400)
                              .json({ status: 0, message: err.message });
                          }
                        }
                      );
                    }
                  } else {
                    isError = true;
                    return res
                      .status(400)
                      .json({ status: 0, message: err.message });
                  }
                }
              );
            }
            if (s2name && str2_id) {
              sql.query(
                `UPDATE strategy SET name = "${s2name}" WHERE id = ${str2_id}`,
                async (err, resultStr) => {
                  if (!err) {
                    isError = false;
                    if (s2l1) {
                      sql.query(
                        `UPDATE legs SET strategy_id = ${str2_id},setting_id=${setting_id},buy_sell="${
                          leg3[0]
                        }",strike_price=${leg3[1]},call_put="${
                          leg3[2]
                        }",quantity=${
                          leg3[3].match(r) * 25 * total_quantity
                        } WHERE id = ${leg3_id}`,
                        async (err, result) => {
                          if (!err) {
                            isError = false;
                          } else {
                            isError = true;
                            return res
                              .status(400)
                              .json({ status: 0, message: err.message });
                          }
                        }
                      );
                    }
                    if (s2l2) {
                      sql.query(
                        `UPDATE legs SET strategy_id = ${str2_id},setting_id=${setting_id},buy_sell="${
                          leg4[0]
                        }",strike_price=${leg4[1]},call_put="${
                          leg4[2]
                        }",quantity=${
                          leg4[3].match(r) * 25 * total_quantity
                        } WHERE id = ${leg4_id}`,
                        async (err, result) => {
                          if (!err) {
                            isError = false;
                          } else {
                            isError = true;
                            return res
                              .status(400)
                              .json({ status: 0, message: err.message });
                          }
                        }
                      );
                    }
                  } else {
                    isError = true;
                    return res
                      .status(400)
                      .json({ status: 0, message: err.message });
                  }
                }
              );
            }

            if (isError === false) {
              if (req.cookies.access_token) {
                res.redirect(
                  `/marketOrder?status=success&request_token=${req.cookies.access_token}&MarketOrder=&action=login&type=login`
                );
              } else {
                res.redirect("/user");
              }
            }
          } else {
            return res.status(400).json({ status: 0, message: err.message });
          }
        }
      );
    }
  } catch (err) {
    return res.status(400).json({ status: 0, message: err.message });
  }
};
exports.MarketOrder = async (req, res) => {
  try {
    const reqtoken = req.query.request_token;
    if (reqtoken) {
      res.cookie("access_token", reqtoken);
      const access_token = await generateSession(reqtoken);
      return res.render("MarketOrderInformation");
    } else {
      return res.redirect("/user");
    }
  } catch (err) {
    if (err.error_type == "TokenException") {
      return res.redirect("/user");
    }
  }
};
exports.niftyWatcher = async () => {
  try {
    const bnPrice = await getNiftyPrice();
    return bnPrice;
  } catch (err) {
    console.log(err);
  }
};
exports.getSettingdata = async (callback) => {
  var querySelect =
    "select legs.id as legs_id,legs.buy_sell,legs.strike_price,legs.call_put,legs.quantity,setting.* from legs LEFT JOIN setting ON setting.id = legs.setting_id";
  var querySelect1 = "select * from strategy";
  sql.query(querySelect, function (err, data, fields) {
    if (err) throw err;
    sql.query(querySelect1, function (err, data1, fields) {
      let alldata = [{ setting_data: data }, { str_value: data1 }];
      Promise.all(alldata).then((data) => {
        return callback(data);
      });
    });
  });
};
exports.positions = async (callback) => {
  const positions = await getPositions()
    .then((res) => {
      return res?.net;
    })
    .catch((error) => {
      console.log("errorerrorerror", error);
    });
  callback(positions);
  // Promise.all(positions).then((data) => {
  //   return callback(data);
  // });
};

exports.getOrder = async (callback) => {
  var querySelect = `SELECT orders.*,strategy.name,setting.exit_bn_profit,setting.exit_bn_loss,setting.exit_time FROM orders LEFT JOIN legs ON orders.leg_id=legs.id LEFT JOIN setting ON orders.setting_id=setting.id Left JOIN strategy ON orders.strategy_id=strategy.id where orders.created_at ='${moment().format(
    "YYYY-MM-DD"
  )}' ORDER BY orders.strategy_id`;
  sql.query(querySelect, function (err, data, fields) {
    if (err) throw err;
    let orderData = data.map(async (items) => {
      const bnPrice = await getNiftyPrice();
      let strike = Math.round(bnPrice / 100) * 100;
      let entrystrike = Math.round(items.entry_bn / 100) * 100;
      let strike_price = items.strike_price - entrystrike;
      let code = `NFO:BANKNIFTY${getThurday}${
        items.strike_price
      }${items.call_put.toUpperCase()}`;
      let quote = await getQuotes([code]);

      let quoteval = quote ? quote[code] : null;

      // console.log("orderData[2]orderData[2]orderData[2]", orderData?.[2]);
      if (items.exit_date_time === null && items.exit_price === null) {
        return {
          ...items,
          current_value: quoteval?.last_price,
          strikeCurrent: strike_price,
          entrystrike: entrystrike,
          orderError: items.order_error,
        };
      } else {
        return {
          ...items,
          strikeCurrent: strike_price,
          entrystrike: entrystrike,
          orderError: items.order_error,
          // orderError: orderData?.[2].status
          //   ? orderData?.[2]?.status_message
          //   : "",
        };
      }
    });

    Promise.all(orderData).then((data) => {
      return callback(data);
    });
  });
};

exports.strategiesWatcher = async () => {
  try {
    let legs = await getOrdersLegs();
    if (legs) {
      let order = [];

      const bnPrice = await getNiftyPrice();
      let strike = Math.round(bnPrice / 100) * 100;

      for (let index = 0; index < legs.length; index++) {
        let leg = legs[index];
        // console.log("legleglegleg", leg);

        let totalQuantity = leg.quantity / 25;
        let current_time = moment(new Date(), "HH:mm:ss").format("HH:mm");
        // let remainingQut = totalQuantity - leg.allow_order;
        const remainingQuantity = totalQuantity;
        const chunkSize = leg.allow_order;

        const numberOfChunks = Math.ceil(remainingQuantity / chunkSize);
        const chunkQuantities = [];

        for (let i = 0; i < numberOfChunks; i++) {
          const chunkQuantity = Math.min(
            chunkSize,
            remainingQuantity - i * chunkSize
          );
          chunkQuantities.push(chunkQuantity);
        }

        for (let j = 0; j < chunkQuantities.length; j++) {
          if (
            current_time >=
              moment(leg.entry_time, "HH:mm:ss").format("HH:mm") &&
            current_time <=
              moment(leg.entry_time, "HH:mm:ss").format("HH:mm") &&
            current_time <= moment(leg.exit_time, "HH:mm:ss").format("HH:mm")
          ) {
            let strike_price = strike + leg.strike_price;
            let code = `NFO:BANKNIFTY${getThurday}${strike_price}${leg.call_put.toUpperCase()}`;
            let quote = await getQuotes([code]);
            let quoteval = quote ? quote[code] : null;
            if (quoteval) {
              let currentRate = quoteval.last_price;
              let params = {
                exchange: "NFO",
                tradingsymbol: `BANKNIFTY${getThurday}${strike_price}${leg.call_put.toUpperCase()}`,
                transaction_type: leg.buy_sell == "Buy" ? "BUY" : "SELL",
                quantity: leg.quantity,
                product: "MIS",
                order_type: leg.order_type,
              };
              const place_order = await placeOrder("regular", params);
              const orderData = await getOrderdata(place_order.order_id);
              let newData = {
                strategy_id: leg.strategy_id,
                setting_id: leg.setting_id,
                leg_id: leg.id,
                buy_sell: leg.buy_sell,
                strike_price: strike_price,
                call_put: leg.call_put,
                quantity: chunkQuantities[j] * 25,
                entry_price: currentRate,
                entry_bn: bnPrice,
                entry_date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
                created_at: moment().format("YYYY-MM-DD"),
                order_live_id: place_order.order_id,
                order_error: orderData?.[2].status
                  ? orderData?.[2]?.status_message
                  : "",
              };

              order.push(newData);
            }
          }
        }

        //   if (totalQuantity < leg.allow_order) {
        //     if (
        //       current_time >=
        //         moment(leg.entry_time, "HH:mm:ss").format("HH:mm") &&
        //       current_time <=
        //         moment(leg.entry_time, "HH:mm:ss").format("HH:mm") &&
        //       current_time <= moment(leg.exit_time, "HH:mm:ss").format("HH:mm")
        //     ) {
        //       await this.addOrder({ leg: leg, remainqty: false });
        //     }
        //   } else {
        //     if (
        //       current_time >=
        //         moment(leg.entry_time, "HH:mm:ss").format("HH:mm") &&
        //       current_time <=
        //         moment(leg.entry_time, "HH:mm:ss").format("HH:mm") &&
        //       current_time <= moment(leg.exit_time, "HH:mm:ss").format("HH:mm")
        //     ) {
        //       let strike_price = strike + leg.strike_price;
        //       let code = `NFO:BANKNIFTY${getThurday}${strike_price}${leg.call_put.toUpperCase()}`;
        //       let quote = await getQuotes([code]);
        //       let quoteval = quote ? quote[code] : null;
        //       if (quoteval) {
        //         let currentRate = quoteval.last_price;
        //         let params = {
        //           exchange: "NFO",
        //           tradingsymbol: `BANKNIFTY${getThurday}${strike_price}${leg.call_put.toUpperCase()}`,
        //           transaction_type: leg.buy_sell == "Buy" ? "BUY" : "SELL",
        //           quantity: leg.quantity,
        //           product: "MIS",
        //           order_type: leg.order_type,
        //         };
        //         const place_order = await placeOrder("regular", params);
        //         const orderData = await getOrderdata(place_order.order_id);
        //         let newData = {
        //           strategy_id: leg.strategy_id,
        //           setting_id: leg.setting_id,
        //           leg_id: leg.id,
        //           buy_sell: leg.buy_sell,
        //           strike_price: strike_price,
        //           call_put: leg.call_put,
        //           quantity: leg.allow_order * 25,
        //           entry_price: currentRate,
        //           entry_bn: bnPrice,
        //           entry_date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        //           created_at: moment().format("YYYY-MM-DD"),
        //           order_live_id: place_order.order_id,
        //           order_error: orderData?.[2].status
        //             ? orderData?.[2]?.status_message
        //             : "",
        //         };
        //         if (remainingQut) {
        //           let newDataremain = {
        //             strategy_id: leg.strategy_id,
        //             setting_id: leg.setting_id,
        //             leg_id: leg.id,
        //             buy_sell: leg.buy_sell,
        //             strike_price: strike_price,
        //             call_put: leg.call_put,
        //             quantity: remainingQut * 25,
        //             entry_price: currentRate,
        //             entry_bn: bnPrice,
        //             entry_date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        //             created_at: moment().format("YYYY-MM-DD"),
        //             order_live_id: place_order.order_id,
        //             order_error: orderData?.[2].status
        //               ? orderData?.[2]?.status_message
        //               : "",
        //           };
        //           order.push(newDataremain);
        //         }
        //         order.push(newData);
        //       }
        //     }
        //   }
      }
      console.log("orderorderorderorderorder---->", order);
      if (order.length > 0) {
        await this.addOrder({ leg: order, remainqty: true });
      }

      //   return;
    }
    return;
  } catch (err) {
    console.log(err);
  }
};

exports.addOrder = async (req, res) => {
  try {
    let { leg, remainqty } = req;
    if (remainqty) {
      for (let index = 0; index < leg.length; index++) {
        const element = leg[index];
        let query = "INSERT INTO orders SET ?";
        sql.query(
          `SELECT * FROM orders where leg_id=${
            element.leg_id
          } AND created_at ="${moment().format(
            "YYYY-MM-DD"
          )}" AND exit_date_time IS NULL`,
          async (err, result) => {
            console.log("errerrerrerrerrerr", err);
            if (result && result.length <= 0) {
              sql.query(query, [element]);
            }
          }
        );
      }
    } else {
      sql.query(
        `SELECT * FROM orders where leg_id=${
          leg.id
        } AND created_at ="${moment().format(
          "YYYY-MM-DD"
        )}" AND exit_date_time IS NULL`,
        async (err, result) => {
          if (result && result.length <= 0) {
            console.log("legleglegleglegleg", leg);
            commonFunctionForDataInsert(leg);
          }
        }
      );
    }
  } catch (err) {
    console.log("err");
  }
};

async function commonFunctionForDataInsert(leg) {
  let order = {};
  const bnPrice = await getNiftyPrice();
  let strike = Math.round(bnPrice / 100) * 100;
  let strike_price = strike + leg.strike_price;
  let code = `NFO:BANKNIFTY${getThurday}${strike_price}${leg.call_put.toUpperCase()}`;
  let quote = await getQuotes([code]);
  let quoteval = quote ? quote[code] : null;
  console.log("quotevalquotevalquoteval", quoteval);
  if (quoteval) {
    let currentRate = quoteval.last_price;
    let query = "INSERT INTO orders SET ?";
    let params = {
      exchange: "NFO",
      tradingsymbol: `BANKNIFTY${getThurday}${strike_price}${leg.call_put.toUpperCase()}`,
      transaction_type: leg.buy_sell == "Buy" ? "BUY" : "SELL",
      quantity: leg.quantity,
      product: "MIS",
      order_type: leg.order_type,
    };
    console.log("leg.buy_sellleg.buy_sell", leg.order_type);
    const place_order = await placeOrder("regular", params);
    console.log("place_orderplace_orderplace_order", place_order);
    const orderData = await getOrderdata(place_order.order_id);
    order = {
      strategy_id: leg.strategy_id,
      setting_id: leg.setting_id,
      leg_id: leg.id,
      buy_sell: leg.buy_sell,
      strike_price: strike_price,
      call_put: leg.call_put,
      quantity: leg.quantity,
      entry_price: currentRate,
      entry_bn: bnPrice,
      entry_date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
      created_at: moment().format("YYYY-MM-DD"),
      order_live_id: place_order.order_id,
      order_error: orderData?.[2].status ? orderData?.[2]?.status_message : "",
    };
    console.log("orderorderorderorder", order);
    if (place_order.order_id) {
      sql.query(query, [order]);
      params.time = moment().format("YYYY-MM-DD HH:mm:ss");
      params.price = currentRate;
      logger.log("debug", params);
    }
  }
}

exports.orderWatcher = async () => {
  sql.query(
    `SELECT orders.*,setting.exit_bn_profit,setting.sl_value,setting.order_type,setting.exit_bn_loss,setting.exit_time FROM orders LEFT JOIN legs ON orders.leg_id=legs.id LEFT JOIN setting ON orders.setting_id=setting.id WHERE orders.exit_price IS NULL AND orders.created_at ='${moment().format(
      "YYYY-MM-DD"
    )}'`,
    async (err, res) => {
      // console.log("errerrerrerrerr--->?", err, res);
      if (!err) {
        for (i in res) {
          let order = res[i];
          const code = `NFO:BANKNIFTY${getThurday}${
            order.strike_price
          }${order.call_put.toUpperCase()}`;
          const quote = await getQuotes([code]);
          const currentRate = quote ? quote[code].last_price : 0;
          let bnPrice = await getNiftyPrice();
          let bnDiff = bnPrice - order.entry_bn;
          let rateDiff = (currentRate - order.entry_price).toFixed(2);
          let current_time = moment(new Date(), "HH:mm:ss").format("HH:mm");
          let exit_sl_plus_price = order.entry_price + order.sl_value;
          let exit_sl_minus_price = order.entry_price - order.sl_value;

          if (
            (order.exit_time && current_time > order.exit_time) ||
            bnDiff >= order.exit_bn_profit ||
            (bnDiff < 0 && Math.abs(bnDiff) >= order.exit_bn_loss) ||
            (order.order_type === "SL" &&
              parseFloat(exit_sl_plus_price.toFixed(2)) === currentRate) ||
            (order.order_type === "SL" &&
              parseFloat(exit_sl_minus_price.toFixed(2)) === currentRate)
          ) {
            let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
            let update_query = `UPDATE orders SET exit_price = ${currentRate},exit_date_time="${currentTime}", pnl=${rateDiff} ,exit_bn=${bnPrice} WHERE orders.id = ${
              order.id
            } AND created_at='${moment().format("YYYY-MM-DD")}' `;
            let params = {
              exchange: "NFO",
              tradingsymbol: `BANKNIFTY${getThurday}${
                order.strike_price
              }${order.call_put.toUpperCase()}`,
              transaction_type: order.buy_sell == "Buy" ? "SELL" : "BUY",
              quantity: order.quantity,
              product: "MIS",
              order_type: order.order_type,
            };

            const place_order = await placeOrder("regular", params);
            console.log("place_orderplace_orderplace_order", place_order);
            if (place_order) {
              sql.query(update_query, (err, res) => {
                if (err) {
                  console.log(err);
                }
              });

              params.pnl = rateDiff;
              params.exit_price = currentRate;
              params.exit_date_time = currentTime;
              params.time = moment().format("YYYY-MM-DD HH:mm:ss");
              params.exit_bn = bnPrice;
              logger.log("info", params);
            }
          }
        }
      }
    }
  );
};
exports.getOrdermarketprice = async (req, result) => {
  console.log("reqreqreqreqreqreq----------->", req);
  let updatedQuery = false;
  sql.query(
    `SELECT orders.*,setting.exit_bn_profit,setting.sl_value,setting.order_type,setting.exit_bn_loss,setting.exit_time FROM orders LEFT JOIN legs ON orders.leg_id=legs.id LEFT JOIN setting ON orders.setting_id=setting.id WHERE orders.exit_price IS NULL AND orders.created_at ='${moment().format(
      "YYYY-MM-DD"
    )}'`,
    async (err, res) => {
      console.log("errerrerrerrerr--->?", err, res);
      if (!err) {
        for (i in res) {
          let order = res[i];
          const code = `NFO:BANKNIFTY${getThurday}${
            order.strike_price
          }${order.call_put.toUpperCase()}`;
          const quote = await getQuotes([code]);
          const currentRate = quote ? quote[code].last_price : 0;
          let bnPrice = await getNiftyPrice();
          let rateDiff = (currentRate - order.entry_price).toFixed(2);
          let exit_sl_plus_price = order.entry_price + order.sl_value;
          let exit_sl_minus_price = order.entry_price - order.sl_value;

          console.log("orderorderorderorder", order);
          if (
            (req.params.type === "SL" &&
              parseFloat(exit_sl_plus_price.toFixed(2)) === currentRate) ||
            (req.params.type === "SL" &&
              parseFloat(exit_sl_minus_price.toFixed(2)) === currentRate)
          ) {
            let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
            let update_query = `UPDATE orders SET exit_price = ${currentRate},exit_date_time="${currentTime}", pnl=${rateDiff} ,exit_bn=${bnPrice} WHERE orders.id = ${
              order.id
            } AND created_at='${moment().format("YYYY-MM-DD")}' `;
            let params = {
              exchange: "NFO",
              tradingsymbol: `BANKNIFTY${getThurday}${
                order.strike_price
              }${order.call_put.toUpperCase()}`,
              transaction_type: order.buy_sell == "Buy" ? "SELL" : "BUY",
              quantity: order.quantity,
              product: "MIS",
              order_type: order.order_type,
            };

            const place_order = await placeOrder("regular", params);
            console.log("place_orderplace_orderplace_order", place_order);
            if (place_order.order_id) {
              sql.query(update_query, (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  updatedQuery = true;
                }
              });
              params.pnl = rateDiff;
              params.exit_price = currentRate;
              params.exit_date_time = currentTime;
              params.time = moment().format("YYYY-MM-DD HH:mm:ss");
              params.exit_bn = bnPrice;
              logger.log("info", params);
              updatedQuery = true;
            }
          } else {
            let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
            let update_query = `UPDATE orders SET exit_price = ${currentRate},exit_date_time="${currentTime}", pnl=${rateDiff} ,exit_bn=${bnPrice} WHERE orders.id = ${
              order.id
            } AND created_at='${moment().format("YYYY-MM-DD")}' `;
            let params = {
              exchange: "NFO",
              tradingsymbol: `BANKNIFTY${getThurday}${
                order.strike_price
              }${order.call_put.toUpperCase()}`,
              transaction_type: order.buy_sell == "Buy" ? "SELL" : "BUY",
              quantity: order.quantity,
              product: "MIS",
              order_type: order.order_type,
            };

            const place_order = await placeOrder("regular", params);
            console.log("place_orderplace_orderplace_order", place_order);
            if (place_order.order_id) {
              sql.query(update_query, (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  updatedQuery = true;
                }
              });
              params.pnl = rateDiff;
              params.exit_price = currentRate;
              params.exit_date_time = currentTime;
              params.time = moment().format("YYYY-MM-DD HH:mm:ss");
              params.exit_bn = bnPrice;
              logger.log("info", params);
              updatedQuery = true;
            }
          }
        }
      } else {
        updatedQuery = false;
      }
      if (updatedQuery === true) {
        if (req.cookies.access_token) {
          console.log("req.cookies.access_token", req.cookies.access_token);
          return result.redirect(
            `/marketOrder?action=login&type=login&status=success&request_token=${req.cookies.access_token}F&MarketOrder=`
          );
        } else {
          result.redirect("/user");
        }
      }
    }
  );
};
exports.OrderStrategy = async (req, result) => {
  let updatedQuery = false;
  sql.query(
    `SELECT orders.*,setting.exit_bn_profit,setting.sl_value,setting.order_type,setting.exit_bn_loss,setting.exit_time FROM orders LEFT JOIN legs ON orders.leg_id=legs.id LEFT JOIN setting ON orders.setting_id=setting.id WHERE orders.exit_price IS NULL AND orders.strategy_id=${req.params.id}`,
    async (err, res) => {
      console.log("errerrerrerrerr--->?", err, res);
      if (!err) {
        for (i in res) {
          let order = res[i];
          const code = `NFO:BANKNIFTY${getThurday}${
            order.strike_price
          }${order.call_put.toUpperCase()}`;
          const quote = await getQuotes([code]);
          const currentRate = quote ? quote[code].last_price : 0;
          let bnPrice = await getNiftyPrice();
          let rateDiff = (currentRate - order.entry_price).toFixed(2);
          let exit_sl_plus_price = order.entry_price + order.sl_value;
          let exit_sl_minus_price = order.entry_price - order.sl_value;

          if (
            (req.params.type === "SL" &&
              parseFloat(exit_sl_plus_price.toFixed(2)) === currentRate) ||
            (req.params.type === "SL" &&
              parseFloat(exit_sl_minus_price.toFixed(2)) === currentRate)
          ) {
            let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
            let update_query = `UPDATE orders SET exit_price = ${currentRate},exit_date_time="${currentTime}", pnl=${rateDiff} ,exit_bn=${bnPrice} WHERE orders.id = ${
              order.id
            } AND created_at='${moment().format("YYYY-MM-DD")}' `;
            let params = {
              exchange: "NFO",
              tradingsymbol: `BANKNIFTY${getThurday}${
                order.strike_price
              }${order.call_put.toUpperCase()}`,
              transaction_type: order.buy_sell == "Buy" ? "SELL" : "BUY",
              quantity: order.quantity,
              product: "MIS",
              order_type: order.order_type,
            };

            const place_order = await placeOrder("regular", params);
            console.log("place_orderplace_orderplace_order", place_order);
            if (place_order.order_id) {
              sql.query(update_query, (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  updatedQuery = true;
                }
              });
              params.pnl = rateDiff;
              params.exit_price = currentRate;
              params.exit_date_time = currentTime;
              params.time = moment().format("YYYY-MM-DD HH:mm:ss");
              params.exit_bn = bnPrice;
              logger.log("info", params);
              updatedQuery = true;
            }
          } else {
            let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
            let update_query = `UPDATE orders SET exit_price = ${currentRate},exit_date_time="${currentTime}", pnl=${rateDiff} ,exit_bn=${bnPrice} WHERE orders.id = ${
              order.id
            } AND created_at='${moment().format("YYYY-MM-DD")}' `;
            let params = {
              exchange: "NFO",
              tradingsymbol: `BANKNIFTY${getThurday}${
                order.strike_price
              }${order.call_put.toUpperCase()}`,
              transaction_type: order.buy_sell == "Buy" ? "SELL" : "BUY",
              quantity: order.quantity,
              product: "MIS",
              order_type: order.order_type,
            };

            const place_order = await placeOrder("regular", params);
            console.log("place_orderplace_orderplace_order", place_order);
            if (place_order.order_id) {
              sql.query(update_query, (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  updatedQuery = true;
                }
              });
              params.pnl = rateDiff;
              params.exit_price = currentRate;
              params.exit_date_time = currentTime;
              params.time = moment().format("YYYY-MM-DD HH:mm:ss");
              params.exit_bn = bnPrice;
              logger.log("info", params);
              updatedQuery = true;
            }
          }
        }
      } else {
        updatedQuery = false;
      }
      if (updatedQuery === true) {
        if (req.cookies.access_token) {
          console.log("req.cookies.access_token", req.cookies.access_token);
          return result.redirect(
            `/marketOrder?action=login&type=login&status=success&request_token=${req.cookies.access_token}F&MarketOrder=`
          );
        } else {
          result.redirect("/user");
        }
      }
    }
  );
};

exports.orderForMarket = async (req, result) => {
  let updatedQuery = false;
  sql.query(
    `SELECT orders.*,setting.exit_bn_profit,setting.sl_value,setting.order_type,setting.exit_bn_loss,setting.exit_time FROM orders LEFT JOIN legs ON orders.leg_id=legs.id LEFT JOIN setting ON orders.setting_id=setting.id WHERE orders.exit_price IS NULL AND orders.id=${req.params.id} `,
    async (err, res) => {
      if (!err) {
        // for (i in res) {
        let order = res;
        console.log("orderorderorderorderorder", order);
        const bnPrice = await getNiftyPrice();
        const code = `NFO:BANKNIFTY${getThurday}${order[0].strike_price}${order[0].call_put}`;
        const quote = await getQuotes([code]);
        const currentRate = quote ? quote?.[code]?.last_price : 0;
        let exit_sl_plus_price = order[0].entry_price + order[0].sl_value;
        let exit_sl_minus_price = order[0].entry_price - order[0].sl_value;

        let rateDiff = currentRate - order[0].entry_price;
        if (
          (req.params.type === "SL" &&
            parseFloat(exit_sl_plus_price.toFixed(2)) === currentRate) ||
          (req.params.type === "SL" &&
            parseFloat(exit_sl_minus_price.toFixed(2)) === currentRate)
        ) {
          let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
          let update_query = `UPDATE orders SET exit_price = ${currentRate},exit_date_time="${currentTime}", pnl=${rateDiff} ,exit_bn=${bnPrice} WHERE orders.id = ${order[0].id}`;
          let params = {
            exchange: "NFO",
            tradingsymbol: `BANKNIFTY${getThurday}${order[0].strike_price}${order[0].call_put}`,
            transaction_type: order[0].buy_sell == "Buy" ? "SELL" : "BUY",
            quantity: order[0].quantity,
            product: "MIS",
            order_type: order.order_type,
          };
          console.log("paramsparamsparamsparams", params);
          const place_order = await placeOrder("regular", params);
          if (place_order.order_id) {
            sql.query(update_query, (err, res) => {
              if (err) {
                console.log(err);
              } else {
                updatedQuery = true;
              }
            });
            params.pnl = rateDiff;
            params.exit_price = currentRate;
            params.exit_date_time = currentTime;
            params.time = moment().format("YYYY-MM-DD HH:mm:ss");
            params.exit_bn = bnPrice;
            logger.log("info", params);
            updatedQuery = true;
          }
        } else {
          let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
          let update_query = `UPDATE orders SET exit_price = ${currentRate},exit_date_time="${currentTime}", pnl=${rateDiff} ,exit_bn=${bnPrice} WHERE orders.id = ${order[0].id}`;
          let params = {
            exchange: "NFO",
            tradingsymbol: `BANKNIFTY${getThurday}${order[0].strike_price}${order[0].call_put}`,
            transaction_type: order[0].buy_sell == "Buy" ? "SELL" : "BUY",
            quantity: order[0].quantity,
            product: "MIS",
            order_type: order.order_type,
          };
          console.log("paramsparamsparamsparams", params);
          const place_order = await placeOrder("regular", params);
          if (place_order.order_id) {
            sql.query(update_query, (err, res) => {
              if (err) {
                console.log(err);
              } else {
                updatedQuery = true;
              }
            });
            params.pnl = rateDiff;
            params.exit_price = currentRate;
            params.exit_date_time = currentTime;
            params.time = moment().format("YYYY-MM-DD HH:mm:ss");
            params.exit_bn = bnPrice;
            logger.log("info", params);
            updatedQuery = true;
          }
        }

        // let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
        // let update_query = `UPDATE orders SET exit_price = ${currentRate},exit_date_time="${currentTime}", pnl=${rateDiff} ,exit_bn=${bnPrice} WHERE orders.id = ${order[0].id}`;
        // let params = {
        //   exchange: "NFO",
        //   tradingsymbol: `BANKNIFTY${getThurday}${order[0].strike_price}${order[0].call_put}`,
        //   transaction_type: order[0].buy_sell == "Buy" ? "SELL" : "BUY",
        //   quantity: order[0].quantity,
        //   product: "MIS",
        //   order_type: order.order_type,
        // };
        // console.log("paramsparamsparamsparams", params);
        // const place_order = await placeOrder("regular", params);
        // if (place_order.order_id) {
        //   sql.query(update_query, (err, res) => {
        //     if (err) {
        //       console.log(err);
        //     } else {
        //       updatedQuery = true;
        //     }
        //   });
        //   params.pnl = rateDiff;
        //   params.exit_price = currentRate;
        //   params.exit_date_time = currentTime;
        //   params.time = moment().format("YYYY-MM-DD HH:mm:ss");
        //   params.exit_bn = bnPrice;
        //   logger.log("info", params);
        //   updatedQuery = true;
        // }
      } else {
        updatedQuery = false;
      }
      console.log(
        "req.cookies.access_token",
        req.cookies.access_token,
        updatedQuery
      );

      if (updatedQuery === true) {
        if (req.cookies.access_token) {
          console.log("req.cookies.access_token", req.cookies.access_token);
          return result.redirect(
            `/marketOrder?action=login&type=login&status=success&request_token=${req.cookies.access_token}F&MarketOrder=`
          );
        } else {
          result.redirect("/user");
        }
      }
    }
  );
};
