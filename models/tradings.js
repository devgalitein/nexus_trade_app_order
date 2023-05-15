module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
      "tradings",
      {
        date: {
          type: DataTypes.DATE,
          primaryKey: true,
          autoIncrement: true,
        },
        opening: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        closing: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        avgRate: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps:false
      }
    );
  };