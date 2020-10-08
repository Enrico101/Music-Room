var express = require('express');
var index = require('./mobile-routes/index');
const dotenv = require('dotenv');

dotenv.config();

var serverAppPort = process.env.SERVER_APP_PORT;
var secretString = Math.floor((Math.random() * 10000) + 1);
var Port = serverAppPort;
var app = express();

app.set('view engine', 'ejs');

app.listen(Port, (err) => {
    if (err)
        console.log(err);
    else
        console.log("mobile app is listening on port: "+Port);
})