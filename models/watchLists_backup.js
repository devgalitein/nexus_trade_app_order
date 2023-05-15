module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
      "watchLists_backups",
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
      },
      {
        timestamps:false
      }
    );
  };