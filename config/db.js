const mysql = require("mysql");
const env = require("../global");

module.exports = connection = mysql.createConnection({
  host: env.HOST,
  user: env.USER,
  password: env.PASSWORD,
  database: env.DATABASE,
});
