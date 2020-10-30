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
var addPlaylist = require('./server-routes/addPlaylist');
var getPlaylist = require('./server-routes/getPlaylist');
var add_access_token = require('./server-routes/add_access_token');
var get_access_token = require('./server-routes/get_access_token');
var get_playlist_invites = require('./server-routes/getPlaylistInvites');
var add_playlist_invite = require('./server-routes/addPlaylistInvite');
var get_my_playlist = require('./server-routes/get_my_playlists');
const checkUser = require('./server-routes/checkUser');

app.set('view engine', 'ejs');
app.use('/newUser', newUser);
app.use('/verifyUser', verifyUser);
app.use('/settings', settings);
app.use('/add_playlist', addPlaylist);
app.use('/get_playlist', getPlaylist);
app.use('/get_my_playlist', get_my_playlist);
app.use('/add_access_token', add_access_token);
app.use('/get_access_token', get_access_token);
app.use('/get_playlist_invites', get_playlist_invites);
app.use('/add_playlist_invite', add_playlist_invite);
app.use('/settings', settings); 
app.use('/checkUser', checkUser);

app.listen(Port, (err) => {
    if (err)
        console.log(err);
    else
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${Port}`);
})