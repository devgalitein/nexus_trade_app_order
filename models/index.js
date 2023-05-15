const Sequelize = require("sequelize");

const { DB_NAME, DB_USER, DB_PASS } = require("../config/dbConfig");

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: "localhost",
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  dialect: "mysql",
  logging: false,
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.watchList = require("./watchLists")(sequelize, Sequelize);
db.trading = require("./tradings")(sequelize, Sequelize);
db.watchLists_backup = require("./watchLists_backup")(sequelize, Sequelize);
module.exports = db;
