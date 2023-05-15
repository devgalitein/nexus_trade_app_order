"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const legs = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      strategy_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "strategy", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      setting_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "setting", key: "id" },
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
        type: Sequelize.DOUBLE,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
      },
    };
    await queryInterface.createTable("legs", legs);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("legs");
  },
};
