const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();


const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbName = process.env.DB_NAME;

var conInit = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    port: 3306,
    password: process.env.DB_PASSWORD
});

var con = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    port: 3306,
    password: process.env.DB_PASSWORD,
    database: dbName
});

conInit.connect((err) =>{
    if (err) throw err;
});



con.connect((err) =>{
    if (err) throw err;
    console.log('Database Connected');
});

module.exports = {
    conInit,
    con
};