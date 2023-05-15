require('dotenv').config();
module.exports = function (sequelize, DataTypes) {
  const watchList = sequelize.define(
    "watchList",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      exchangeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tableName: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false
    }
  );
  watchList.afterCreate(async (watch, options) => {
    await sequelize
      .query('CALL create_table (:tableName)',
        { replacements: { tableName:watch.tableName } })
  })
  return watchList;
};
