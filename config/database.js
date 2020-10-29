const {conInit, con} = require("./connection");

var userSql = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(500) NOT NULL, email VARCHAR(500) NOT NULL, password VARCHAR(500) NOT NULL, access_token VARCHAR(500) NOT NULL)";
var imagesSql = "CREATE TABLE IF NOT EXISTS images (id INT AUTO_INCREMENT PRIMARY KEY, imagePath VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL)";
var playlistSql = "CREATE TABLE IF NOT EXISTS playlist (id BIGINT NOT NULL, username VARCHAR(255) NOT NULL, playlist_name VARCHAR(255) NOT NULL, privacy VARCHAR(255) NOT NULL, cover_image VARCHAR(500) NOT NULL)";
var playlistInvitesSql = "CREATE TABLE IF NOT EXISTS playlist_invites (id INT AUTO_INCREMENT PRIMARY KEY, invited_user VARCHAR(500) NOT NULL, playlist_owner VARCHAR(500) NOT NULL, access_token VARCHAR(500) NOT NULL, playlist_id varchar(500) NOT NULL, vover_image varchar(500) NOT NULL, playlist_name varchar(500) NOT NULL)";
var deviceSql = "CREATE TABLE IF NOT EXISTS deviceManager (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, deviceToken VARCHAR(255) NOT NULL, deviceMakeAndModel VARCHAR(255) NOT NULL)";

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

con.query(playlistSql, (err, result) => {
    if (err) throw errl
    console.log("playlist table created");
});

con.query(playlistInvitesSql, (err, result) => {
    if (err) throw errl
    console.log("playlist invites table created");
})

con.query(deviceSql, (err, result) => {
    if (err) throw errl
    console.log("Device Manager table created");
});