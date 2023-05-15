"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const setting = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      entry_time: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      exit_time: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      auto_repeat: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      exit_bn_profit: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      exit_bn_loss: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      total_quantity: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      order_type: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      sl_value: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
      },
    };
    await queryInterface.createTable("setting", setting);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("setting");
  },
};
