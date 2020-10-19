var express = require('express');
var path = require('path');
var socket = require('socket.io');
var events = require('events');
const passport = require('passport');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
var util = require('util');
var session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

dotenv.config();
var passportSetUp = require('./mobile-routes/passportAuth');
var eventEmitter = new events.EventEmitter();
var mobileAppPort = process.env.MOBILE_APP_PORT || 5001;
var secretString = Math.floor((Math.random() * 10000) + 1);
var Port = mobileAppPort;
var app = express();

/* app.use(session({
    secret: secretString.toString(),
    resave: true,
    saveUninitialized: true
})); */

app.use(bodyParser.urlencoded({
    extended: 'true'
}));

const options = {
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
 
const sessionStore = new MySQLStore(options);
 
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    key: process.env.SESS_NAME,
    secret: secretString.toString(),
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({
    extended: 'true'
}));

app.set('views', path.join(__dirname, 'mobile-views'));
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

app.set('myEventEmitter', eventEmitter); // This is done so that we can pass the same eventEmmitter instance in all the routes, so that we can listen to and emit evenst in routes.

var login = require('./mobile-routes/login');
var signup = require('./mobile-routes/signup');
var home = require('./mobile-routes/home');
var deezer_auth = require('./mobile-routes/deezer_auth');
var auth = require('./mobile-routes/oauth');
var logout = require('./mobile-routes/logout');
var search = require('./mobile-routes/search');
var index = require('./mobile-routes/index');
var album = require('./mobile-routes/album');
var music_player = require('./mobile-routes/music_player');
var channel = require('./mobile-routes/channel');
var my_music = require('./mobile-routes/my_music');


app.use(index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/signup', signup);
app.use('/home', home);
app.use('/deezer_auth', deezer_auth);
app.use('/auth', auth);
app.use('/search', search);
app.use('/album', album);
app.use('/music_player', music_player);
app.use('/channel', channel);
app.use('/my_music', my_music);

var server = app.listen(Port, (err) => {
    if (err)
        console.log(err);
    else
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${Port}`);
})
//these routes are only for serving images.
app.get('/sprites/Daco_5913043.png', (req, res) => {
    //res.sendFile('./');
    res.sendFile('/sprites/Daco_5913043.png', { root: __dirname });
})
app.get('/my_music/sprites/Daco_5913043.png', (req, res) => {
    //res.sendFile('./');
    res.sendFile('/sprites/Daco_5913043.png', { root: __dirname });
})

//socket io
var io = socket(server);
app.set('io', io);
//io.on('connection', (socket) => {

    /*console.log("User connected");
    eventEmitter.on('FoundTopTracks', (data) => {
        socket.emit('FoundTopTracks', data);
        var x = 0;
        while(x < 10) 
        {
            console.log(util.inspect(data, { depth: null }));
            console.log(x);
            x++;
        }
    })*/
//    socket.on('disconnect', () => {
//        console.log('User disconnected');
//    })
//})