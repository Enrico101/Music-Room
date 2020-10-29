var express = require('express');
const dotenv = require('dotenv');
var session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

dotenv.config();

var serverAppPort = process.env.SERVER_APP_PORT;
var secretString = Math.floor((Math.random() * 10000) + 1);
var Port = serverAppPort || 5000;
var app = express();

app.use(session({
    secret: secretString.toString(),
    resave: true,
    saveUninitialized: true
}));

var index = require('./mobile-routes/index');
var newUser = require('./server-routes/newUser');
var verifyUser = require('./server-routes/verifyUser');
const settings = require('./server-routes/settingsUpdate');
const checkUser = require('./server-routes/checkUser');

app.set('view engine', 'ejs');
app.use('/newUser', newUser);
app.use('/verifyUser', verifyUser);
app.use('/settings', settings); 
app.use('/checkUser', checkUser);

app.listen(Port, (err) => {
    if (err)
        console.log(err);
    else
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${Port}`);
})