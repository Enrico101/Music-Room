var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var util = require('util');

router = express.Router();

router.get('/', (req, res) => {
    //get playlists
    var playlist_url = 'https://api.deezer.com/user/me/playlists?access_token='+req.session.access_token;

    var playlist_request = unirest('GET', playlist_url);
    playlist_request.end((playlist_response) => {
        if (playlist_response)
        {
            res.render('my_music', {playlists: playlist_response.body.data});
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
                console.log("tracks here: "+util.inspect(tracks_response.body, {depth: null}))
                res.render('playlist_tracks', {tracks: tracks_response.body});
            }
            else
            {
                res.send("An error has occured");
            }
        })
    }
})

module.exports = router;