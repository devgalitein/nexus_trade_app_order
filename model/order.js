"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    strategy_id: DataTypes.INTEGER,
    leg_id: DataTypes.INTEGER,
    buy_sell: DataTypes.STRING,
    strike_price: DataTypes.INTEGER,
    call_put: DataTypes.STRING,
    quantity: DataTypes.STRING,
    entry_date_time: DataTypes.STRING,
    exit_date_time: DataTypes.STRING,
    entry_price: DataTypes.INTEGER,
    exit_price: DataTypes.INTEGER,
    entry_bn: DataTypes.DOUBLE,
    exit_bn: DataTypes.DOUBLE,
  });

  return Order;
};
