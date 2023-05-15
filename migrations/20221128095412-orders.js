"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const orders = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      setting_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "setting", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      strategy_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "strategy", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      leg_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "legs", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      buy_sell: {
        type: Sequelize.CHAR(5),
        allowNull: false,
      },
      strike_price: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      call_put: {
        type: Sequelize.CHAR(5),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pnl: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      entry_date_time: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      exit_date_time: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      entry_price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      exit_price: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      entry_bn: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      exit_bn: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
    };
    await queryInterface.createTable("orders", orders);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("stratordersegy");
  },
};
