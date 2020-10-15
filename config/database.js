const {conInit, con} = require("./connection");

var userSql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(500) NOT NULL, email VARCHAR(500) NOT NULL, password VARCHAR(500) NOT NULL)";
var imagesSql = "CREATE TABLE IF NOT EXISTS images (id INT AUTO_INCREMENT PRIMARY KEY, imagePath VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL)";

conInit.query(`CREATE DATABASE IF NOT EXISTS musicroom`, (err, result) => {
    if (err) throw err;
    console.log('Musicroom database created');
});

con.query(userSql, (err, result) => {
    if (err) throw err;
    console.log("Users Table created");
});

con.query(imagesSql, (err, result) => {
    if (err) throw err;
    console.log("images Table created");
});