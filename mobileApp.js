var express = require('express');
var index = require('./mobile-routes/index');
var path = require('path');
var login = require('./mobile-routes/login');
var signup = require('./mobile-routes/signup');
var home = require('./mobile-routes/home');
var deezer_auth = require('./mobile-routes/deezer_auth');
var search = require('./mobile-routes/search');
var album = require('./mobile-routes/album');
var music_player = require('./mobile-routes/music_player');
var channel = require('./mobile-routes/channel');
var socket = require('socket.io');
var events = require('events');
const dotenv = require('dotenv');
var util = require('util');

dotenv.config();
var eventEmitter = new events.EventEmitter();
var mobileAppPort = process.env.MOBILE_APP_PORT;
var secretString = Math.floor((Math.random() * 10000) + 1);
var Port = mobileAppPort;
var app = express();

app.set('views', path.join(__dirname, 'mobile-views'));
app.set('view engine', 'ejs');
app.set('myEventEmitter', eventEmitter); // This is done so that we can pass the same eventEmmitter instance in all the routes, so that we can listen to and emit evenst in routes.

app.use(index);
app.use('/login', login);
app.use('/signup', signup);
app.use('/home', home);
app.use('/deezer_auth', deezer_auth);
app.use('/search', search);
app.use('/album', album);
app.use('/music_player', music_player);
app.use('/channel', channel);

var server = app.listen(Port, (err) => {
    if (err)
        console.log(err);
    else
        console.log("mobile app is listening on port "+Port);
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