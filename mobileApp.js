var express = require('express');
var path = require('path');
var socket = require('socket.io');
var events = require('events');
const passport = require('passport');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
var util = require('util');
const Fingerprint = require('express-fingerprint');
var session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var unirest = require('unirest');

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

app.use(Fingerprint({
    parameters:[
        // Defaults
        Fingerprint.useragent,
        Fingerprint.acceptHeaders,
        Fingerprint.geoip
    ]
}));

app.use(express.static(path.join(__dirname, 'public')));

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
var settings = require('./mobile-routes/settings');
const { response } = require('express');
var change_privacy = require('./mobile-routes/change_privacy');
var playlist_invite = require('./mobile-routes/playlist_invite');


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
app.use('/settings', settings);
app.use('/change_privacy', change_privacy);
app.use('/playlist_invite', playlist_invite);

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

io.on('connection', (socket) => {

    //console.log("User id: "+socket.id);

    socket.on('join_room', (data) => {
        socket.join('room: '+data.room_number, () => {
            let rooms = Object.keys(socket.rooms);
            console.log("room: "+rooms);
        })
    })
    socket.on('start_player', (data) => {
        var track_id = data.track_id;
        //let rooms = Object.keys(socket.rooms);
        //socket.to(rooms[1]).emit('playlist_updated', {updated_playlist: response_2.body.data});
        //io.to(socket.id).emit('playlist_updated', {updated_playlist: response_2.body.data});
        socket.emit('player_started', {track_id: track_id});
    })
    socket.on('add_song', (data) => {
        var song_id = data.song_id;
        var room_number = data.room_number;
        var playlist_id = data.playlist_id
        var access_token = data.access_token;

        //console.log("add_song event emitted");
        if (song_id != undefined && room_number != undefined && playlist_id != undefined && access_token != undefined)
        {
            var url = 'https://api.deezer.com/playlist/'+playlist_id+'/tracks?request_method=post&access_token='+access_token;
            var url_2 = 'https://api.deezer.com/playlist/'+playlist_id+'/tracks';

            var request = unirest('POST', url).send({"songs": song_id});
            var request_2 = unirest('GET', url_2);

            request.end((response) => {
                if (response.body)
                {
                    request_2.end((response_2) => {
                        if (response_2.body)
                        {
                            let rooms = Object.keys(socket.rooms);
                            socket.to(rooms[1]).emit('playlist_updated', {updated_playlist: response_2.body.data});
                            io.to(socket.id).emit('playlist_updated', {updated_playlist: response_2.body.data});
                        }
                        else
                        {
                            //console.log("An error occured with response from deezer response 2.");
                        }
                    })
                }
                else
                {
                   // console.log("An error occured with response from deezer response 1.");
                }
            })
        }
        else
        {
           // console.log("An error accured when adding song to playlist because data set ins incomplete");
        }
    })
    socket.on('delete_song', (data) => {
        var song_id = data.song_id;
        var room_number = data.room_number;
        var playlist_id = data.playlist_id
        var access_token = data.access_token;

        if (song_id != undefined && room_number != undefined && playlist_id != undefined && access_token != undefined)
        {
            var url = 'https://api.deezer.com/playlist/'+playlist_id+'/tracks?access_token='+access_token+'&songs='+song_id;
            var url_2 = 'https://api.deezer.com/playlist/'+playlist_id+'/tracks';

            var request = unirest('DELETE', url).send({"songs": song_id});
            var request_2 = unirest('GET', url_2);

            request.end((response) => {
                if (response.body)
                {
                    request_2.end((response_2) => {
                        if (response_2.body)
                        {
                            let rooms = Object.keys(socket.rooms);
                            socket.to(rooms[1]).emit('deleted_song_playlist_updated', {updated_playlist: response_2.body.data});
                            io.to(socket.id).emit('deleted_song_playlist_updated', {updated_playlist: response_2.body.data});
                        }
                        else
                        {
                            //console.log("An error occured with response from delete deezer response 2.");
                        }
                    })
                }
                else
                {
                    //console.log("An error occured with response from delete deezer response 1.");
                }
            })
        }
    })
    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
})