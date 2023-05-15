const { check } = require("express-validator");

exports.strategyValidation = [
  check("name", "Please include a valid name").isString(),
  check("entry_time", "Please include a valid entry_time").isString(),
  check("entry_bn", "Please include a valid entry_bn").isFloat(),
  check("exit_time", "Please include a valid exit_time").isString(),
  check("exit_bn_profit", "Please include a valid exit_bn_profit").isFloat(),
  check("exit_bn_loss", "Please include a valid exit_bn_loss").isFloat(),
  check("buy_sell", "Please include a valid buy_sell").isString(),
  check("strike_price", "Please include a valid strike_price").isFloat(),
  check("call_put", "Please include a valid call_put").isString(),
  check("quantity", "Please include a valid quantity").isFloat(),
];
