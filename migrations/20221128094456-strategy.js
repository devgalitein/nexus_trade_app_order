"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const strategy = {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
      },
    };
    await queryInterface.createTable("strategy", strategy);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("strategy");
  },
};
