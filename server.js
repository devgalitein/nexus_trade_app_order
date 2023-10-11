const http = require("http");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenvExpand = require("dotenv-expand");
const expressLayouts = require("express-ejs-layouts");
const moment = require("moment");
dotenvExpand.expand(dotenv.config());

const app = express();
app.use(cookieParser());
app.use(
  session({
    secret: "nexus trade",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 2 },
  })
);

// app.use(cors());
app.use(expressLayouts);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("layout", "layouts/web");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("views", path.join(__dirname, "views"));

const server = http.createServer(app);
const io = new Server(server);
app.locals.baseURL = process.env.SERVER;

const PORT = process.env.PORT || 7000;

const { home, user, setting } = require("./controllers/userController");
const {
  addStrategy,
  MarketOrder,
  strategiesWatcher,
  orderWatcher,
  niftyWatcher,
  getOrder,
  getSettingdata,
  positions,
  orderForMarket,
  orderData,
  OrderStrategy,
  getOrdermarketprice,
  // getBankHolidays
} = require("./controllers/strategyController.js");
// const {
// createWatchList,
// updateWatchList,
// } = require("./controllers/watchListController");
const { strategyValidation } = require("./validator/strategyValidator");
// const {
//   getHistoryData,
//   getBNHistoryData,
//   createBNTable,
// } = require("./controllers/historyController");

app.get("/MarketOrder", MarketOrder);
app.get("/user", home);
app.post("/addStrategy", strategyValidation, addStrategy);
app.get("/strategiesWatcher", strategiesWatcher);
app.get("/orderWatcher", orderWatcher);
app.get("/orderForMarket/:id/:type", orderForMarket);
app.get("/OrderStrategy/:id/:type", OrderStrategy);
app.get("/getOrdermarketprice/:type", getOrdermarketprice);
app.get("/", setting);

require("./socket")(io);
io.on("connection", (socket) => {
  console.log("user connected via socket!");
  let dataNifty;
  let dataOrder;

  socket.on(
    "nifty-data",
    function (data) {
      niftyWatcher()
        .then((res) => {
          dataNifty = res;
          socket.emit("nifty-data-getted", res);
        })
        .catch((error) => {
          console.log("socket error ==>>", error);
        });
    },
    1000
  );
  socket.on(
    "order-data",
    function (data) {
      getOrder((data) => {
        socket.emit("order-data-getted", data);
      });
    },
    1000
  );
  socket.on(
    "setting-data",
    function (data) {
      getSettingdata((data) => {
        socket.emit("setting-data-getted", data);
      });
    },
    1000
  );

  socket.on(
    "order-final-data",
    function (data) {
      getOrder((data) => {
        socket.emit("order-final-data-getted", data);
      });
    },
    1000
  );
  socket.on(
    "position-final-data",
    function (data) {
      positions((data) => {
        socket.emit("position-final-data-getted", data);
      });
    },
    1000
  );
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
