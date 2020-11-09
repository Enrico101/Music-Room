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
var update_playlist_privacy = require('./server-routes/update_playlist_privacy');
var set_rights = require('./server-routes/set_rights');
var get_rights = require('./server-routes/get_rights');
var update_password = require('./server-routes/upate_password');
var deleteDevice = require('./server-routes/deleteDevice');
var getUsers = require('./server-routes/getUsers');
var path = require('path');
var docs = require('./server-routes/docs');

app.set('view engine', 'ejs');
app.use('/api/post_user', newUser);
app.use('/api/verifyUser', verifyUser);
app.use('/api/settings', settings);
app.use('/api/post_playlist', addPlaylist);
app.use('/api/get_playlist', getPlaylist);
app.use('/api/get_my_playlist', get_my_playlist);
app.use('/api/post_access_token', add_access_token);
app.use('/api/get_access_token', get_access_token);
app.use('/api/get_playlist_invites', get_playlist_invites);
app.use('/api/post_playlist_invite', add_playlist_invite);
app.use('/api/settings', settings); 
app.use('/api/checkUser', checkUser);
app.use('/api/post_playlist_privacy', update_playlist_privacy);
app.use('/api/post_rights', set_rights);
app.use('/api/get_rights', get_rights);
app.use('/api/post_new_password', update_password);
app.use('/api/deleteDevice', deleteDevice);
app.use('/api/getUsers', getUsers);
app.use('/docs', docs);

app.set('views', path.join(__dirname, 'server-views'));
app.set('view engine', 'ejs');

app.listen(Port, (err) => {
    if (err)
        console.log(err);
    else
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${Port}`);
})