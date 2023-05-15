require('dotenv').config();
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
module.exports = { DB_NAME,DB_USER,DB_PASS };
