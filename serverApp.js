var express = require('express');
var index = require('./mobile-routes/index');
var newUser = require('./server-routes/newUser');
const dotenv = require('dotenv');

dotenv.config();

var serverAppPort = process.env.SERVER_APP_PORT;
var secretString = Math.floor((Math.random() * 10000) + 1);
var Port = serverAppPort;
var app = express();

app.set('view engine', 'ejs');
app.use('/newUser', newUser);

app.listen(Port, (err) => {
    if (err)
        console.log(err);
    else
        console.log("server app is listening on port: "+Port);
})