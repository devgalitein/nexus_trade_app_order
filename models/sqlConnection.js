const mysql = require("mysql2");
const { DB_NAME,DB_USER,DB_PASS } = require("../config/dbConfig");

let connection = mysql.createPool({
  host: 'localhost',
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = connection;