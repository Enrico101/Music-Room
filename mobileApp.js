var express = require('express');
var index = require('./mobile-routes/index');
var path = require('path');

var secretString = Math.floor((Math.random() * 10000) + 1);
var Port = 3002;
var app = express();

app.set('views', path.join(__dirname, 'mobile-views'));
app.set('view engine', 'ejs');

app.use(index);

app.listen(Port, (err) => {
    if (err)
        console.log(err);
    else
        console.log("mobile app is listening on port "+Port);
})