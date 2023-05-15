const url = require("url");
const hash = require("hash.js");
const dotenv = require("dotenv");
const { curly } = require("node-libcurl");
const dotenvExpand = require("dotenv-expand");

dotenvExpand.expand(dotenv.config());

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const request_token = "tPhJizagxS2F8G5o8FyTcCgMVffNpayG";
const access_token = "SFIjbIZUXSCBYr1UDnQn78fhNJ7ldgW6";

const login_url = `https://kite.zerodha.com/connect/login?v=3&api_key=${API_KEY}&redirect_params=/setting`;
const session_url = "https://api.kite.trade/session/token";
const holding_url = "https://api.kite.trade/portfolio/holdings";
const instrument_url = "https://api.kite.trade/quote?i=NSE:INFY&i=NSE:AWL";
let sess_id;

const checksum = hash
  .sha256()
  .update(`${API_KEY}${request_token}${API_SECRET}`)
  .digest("hex");

async function getSessionId() {
  const { headers } = await curly.get(login_url);

  const location = url.parse(headers[0].location, true);
  sess_id = location.query.sess_id;
  return sess_id;
}

async function login() {
  const { statusCode, data, headers } = await curly.post(
    "https://kite.zerodha.com/api/login",
    {
      postFields: JSON.stringify({ user_id: "JY8385", password: "galitein" }),
      httpHeader: [
        "Content-Type: application/json",
        "Accept: application/json",
        "X-Kite-Version: 3",
      ],
    }
  );

  console.log(statusCode, data, headers);
}

getSessionId().then(() => {
  login();
});
