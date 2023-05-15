const KiteConnect = require("kiteconnect").KiteConnect;

const api_key = process.env.API_KEY;
(secret = process.env.API_SECRET), (access_token = "");

const kc = new KiteConnect({
  api_key: api_key,
});

const generateSession = (token) => {
  return new Promise((resolve, reject) => {
    if (!access_token) {
      kc.generateSession(token, secret)
        .then(function (response) {
          const acct = response["access_token"];

          kc.setAccessToken(acct);
          access_token = acct;
          console.log(access_token);
          resolve(access_token);
        })
        .catch(function (err) {
          reject(err);
        });
    } else {
      kc.setAccessToken(access_token);
      resolve(access_token);
    }
  });
};

const getQuotes = async (codes) => {
  try {
    // console.log("codes", codes);
    const res = await kc.getQuote(codes);
    // console.log("resresres", res);
    return res;
  } catch (err) {
    console.log({ err });
  }
};
const getPositions = async () => {
  return new Promise((resolve, reject) => {
    kc.getPositions()
      .then(function (response) {
        resolve(response);
      })
      .catch(function (err) {
        console.log("errerrerr", err);
        reject(err);
      });
  });
};
const placeOrder = async (variety, params) => {
  console.log("varietyvarietyvariety", params);

  return new Promise((resolve, reject) => {
    // kc.placeOrder(variety, params)
    //   .then(function (response) {
    //     console.log("responseresponseresponse------fdlsfjj", response);
    let response = {
      order_id: "1215452",
    };
    resolve(response);
    // })
    // .catch(function (err) {
    //   console.log("errerrerrbsdbjfjsjfgsj g ", err);
    //   reject(err);
    // });
  });
};
const getOrderdata = async (id) => {
  // return new Promise((resolve, reject) => {
  try {
    const res = await kc.getOrderHistory(id);
    // kc.getOrderHistory(id).then(function (response) {
    //   console.log("getOrdersgetOrdersgetOrdersgetOrders", response);

    // });
    return res;
  } catch (err) {
    console.log({ err });
  }
  // });
};

const getHistoricalData = (instrument_token, interval, from_date, to_date) => {
  return new Promise((resolve, reject) => {
    kc.getHistoricalData(instrument_token, interval, from_date, to_date)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

module.exports = {
  generateSession,
  getQuotes,
  placeOrder,
  getHistoricalData,
  getPositions,
  getOrderdata,
};
