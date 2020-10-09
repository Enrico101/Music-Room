var mysql = require('mysql');

var dotenv = require('dotenv');

dotenv.config();

var host = process.env.DB_HOST;
var user = process.env.DB_USER;
var password = process.env.DB_PASSWORD;
var dbName = process.env.DB_NAME;

var db = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: dbName,
});

module.exports = db;