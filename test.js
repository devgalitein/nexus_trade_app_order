const querystring = require("querystring");
const { Curl } = require("node-libcurl");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand(dotenv.config());

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const hash = require("hash.js");
// const request_token = "RUj0dpaEDIHRDhm8a7g07rVCLd1qu4ro";
const request_token = "tPhJizagxS2F8G5o8FyTcCgMVffNpayG";
const access_token = "SFIjbIZUXSCBYr1UDnQn78fhNJ7ldgW6";
const session_url = "https://api.kite.trade/session/token";
const holding_url = "https://api.kite.trade/portfolio/holdings";
const instrument_url = "https://api.kite.trade/quote?i=NSE:INFY&i=NSE:AWL";
const login_url = `https://kite.zerodha.com/connect/login?v=3&api_key=${API_KEY}&redirect_params=/`;

const checksum = hash
  .sha256()
  .update(`${API_KEY}${request_token}${API_SECRET}`)
  .digest("hex");

// example one

// const curl = new Curl();
// const close = curl.close.bind(curl);

// curl.setOpt(Curl.option.URL, session_url);
// curl.setOpt(Curl.option.POST, true);
// curl.setOpt(
//   Curl.option.POSTFIELDS,
//   querystring.stringify({
//     api_key: API_KEY,
//     request_token,
//     checksum,
//   })
// );

// // curl.on("end", close);
// // console.log("first", curl);
// curl.on("end", function (statusCode, data, headers) {
//   console.info("Status code " + statusCode);
//   console.info("***");
//   console.info("Our response: " + data);
//   console.info("***");
//   console.info("Length: " + data.length);
//   console.info("***");
//   console.info("Total time taken: " + this.getInfo("TOTAL_TIME"));

//   this.close();
// });

// curl.on("error", close);
// curl.perform();

const { curly } = require("node-libcurl");

// example two
// async function test() {
//   const postFields = JSON.stringify({
//     api_key: API_KEY,
//     request_token,
//     checksum,
//   });

//   const { statusCode, data, headers } = await curly.get(
//     `https://kite.zerodha.com/connect/login?v=3&api_key=${API_KEY}&redirect_params=/`,
//     {
//       httpHeader: ["X-Kite-Version: 3"],
//     }
//   );

//   console.log(statusCode, data, headers);
// }

// test();

// async function holdings() {
//   const { statusCode, data, headers } = await curly.get(holding_url, {
//     httpHeader: [
//       "X-Kite-Version: 3",
//       `Authorization: token ${API_KEY}:${access_token}`,
//     ],
//   });

//   console.log(statusCode, data, headers);
// }

// holdings();

// async function instruments() {
//   const { statusCode, data, headers } = await curly.get(instrument_url, {
//     httpHeader: [
//       "X-Kite-Version: 3",
//       `Authorization: token ${API_KEY}:${access_token}`,
//     ],
//   });

//   console.log(statusCode, data, headers);
// }

// instruments();

async function login() {
  console.log("first", login_url);
  const { statusCode, data, headers } = await curly.get(login_url);

  console.log(statusCode, data, headers);
}

login();

// console.log("checksum", checksum, API_KEY);

// const terminate = curlTest.close.bind(curlTest);

// curlTest.setOpt(Curl.option.URL, "https://api.kite.trade/session/token");
// curlTest.setOpt(Curl.option.POST, true);
// curlTest.setOpt(
//   Curl.option.POSTFIELDS,
//   JSON.stringify({
//     api_key: API_KEY,
//     request_token,
//     checksum,
//   })
// );

// curlTest.on("end", function (statusCode, data, headers) {
//   console.info("Status code " + statusCode);
//   console.info("***");
//   console.info("Our response: " + data);
//   console.info("***");
//   console.info("Length: " + data.length);
//   console.info("***");
//   console.info("Total time taken: " + this.getInfo("TOTAL_TIME"));

//   this.close();
// });
// curlTest.on("error", terminate);

// curlTest.perform();
