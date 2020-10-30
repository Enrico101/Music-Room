var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var util = require('util');
const { response } = require('express');

router = express.Router();

router.get('/', (req, res) => {
    //get playlists
    var playlist_url = 'https://api.deezer.com/user/me/playlists?access_token='+req.session.access_token;

    var playlist_request = unirest('GET', playlist_url);
    playlist_request.end((playlist_response) => {
        if (playlist_response)
        {
            res.render('my_music', {playlists: playlist_response.body.data, global_playlist: "", private_playlist: ""});
        }
        else
        {
            res.send("An error occured!");
        }
    })
})

router.post('/playlist/tracks', (req, res) => {
    var playlist_id = req.body.playlist_id;

    if (playlist_id != undefined)
    {
        var tracks_url = 'https://api.deezer.com/playlist/'+playlist_id+'?access_token='+req.session.access_token;

        var tracks_request = unirest('GET', tracks_url);
        tracks_request.end((tracks_response) => {
            if (tracks_response)
            {
                res.render('playlist_tracks', {tracks: tracks_response.body});
            }
            else
            {
                res.send("An error has occured");
            }
        })
    }
})
router.post('/global_playlist/tracks', (req, res) => {
    var playlist_id = req.body.playlist_id;
    var room_number = req.body.room_number;
    var playlist_owner = req.body.playlist_owner;


    if (playlist_id != undefined && room_number != undefined && playlist_owner != undefined)
    {
        var tracks_url = 'https://api.deezer.com/playlist/'+playlist_id;
        var owner_access_token_url = 'http://localhost:3003/get_access_token/'+playlist_owner;

        var tracks_request = unirest('GET', tracks_url);
        tracks_request.end((tracks_response) => {
            if (tracks_response)
            {
                var access_token_request = unirest('GET', owner_access_token_url);

                access_token_request.end((response_from_server) => {
                    if (response_from_server != "error")
                    {
                        res.render('global_playlist_tracks', {tracks: tracks_response.body, room_number: room_number, playlist_id: playlist_id, access_token: response_from_server.body});
                    }
                    else
                    {
                        res.send("An error occured");
                    }
                })
            }
            else
            {
                res.send("An error has occured");
            }
        })
    }
})
router.post('/private_playlist/tracks', (req, res) => {
    var playlist_id = req.body.playlist_id;
    var room_number = req.body.room_number;
    var playlist_owner = req.body.playlist_owner;


    if (playlist_id != undefined && room_number != undefined && playlist_owner != undefined)
    {
        var tracks_url = 'https://api.deezer.com/playlist/'+playlist_id;
        var owner_access_token_url = 'http://localhost:3003/get_access_token/'+playlist_owner;

        var tracks_request = unirest('GET', tracks_url);
        tracks_request.end((tracks_response) => {
            if (tracks_response)
            {
                var access_token_request = unirest('GET', owner_access_token_url);

                access_token_request.end((response_from_server) => {
                    if (response_from_server != "error")
                    {
                        res.render('global_playlist_tracks', {tracks: tracks_response.body, room_number: room_number, playlist_id: playlist_id, access_token: response_from_server.body});
                    }
                    else
                    {
                        res.send("An error occured");
                    }
                })
            }
            else
            {
                res.send("An error has occured");
            }
        })
    }
})
//route for global playlist
router.get('/global_playlist', (req, res) => {
    var url_to_server = 'http://localhost:3003/get_playlist/'+req.session.username;

    var url_to_server_response = unirest('GET', url_to_server);
    url_to_server_response.end((response_from_server) => {
        if (response_from_server.body == "Unable to retrieve playlist data")
        {
            res.send("Unable to retrieve playlist data");
        }
        else if (response_from_server.body == "No data found")
        {
            res.render("my_music", {playlists: "", global_playlist: ""});
        }
        else
        {
            res.render("my_music", {playlists: "", global_playlist: response_from_server.body, private_playlist: ""});
        }
    })
})
//router for private playlists
router.get('/private_playlist', (req, res) => {
    var url_to_server = 'http://localhost:3003/get_playlist_invites';

    var url_to_server_response = unirest('GET', url_to_server);
    url_to_server_response.end((response_from_server) => {
        if (response_from_server.body != 'error')
        {
            var x = 0;
            var data_array = [];

            while (response_from_server.body[x])
            {
                if (response_from_server.body[x].invited_user == req.session.username)
                {
                    data_array.push(response_from_server.body[x]);
                }
                x++;
            }
            res.render('my_music', {playlists: "", global_playlist: "", private_playlist: data_array})
        }
        else
            res.send('error');
    })
})

module.exports = router;