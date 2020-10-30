var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var TorrentIndexer = require('torrent-indexer');
var pirata = require('pirata');
const TorrentSearchApi = require('torrent-search-api');
var torrentStream = require('torrent-stream');
var path = require('path');
var webtorrent = require('webtorrent');
const { ClientResponse } = require('http');
var util = require('util');
const { response } = require('express');


router = express.Router();
const torrentIndexer = new TorrentIndexer();
//webtorrent
var client = new webtorrent();
/*router.use(bodyParser.urlencoded({
    extended: 'true'
}));*/

router.post('/', (req, res) => {
    var track_id = req.body.track_id;
    var track_title = req.body.track_title;
    var cover_image = req.body.cover_image;
    var playlist_name = req.body.playlist_name;
    var privacy = req.body.privacy; //check up on this
    var playlist_id = req.body.playlist_id;

    if (playlist_id != undefined && track_id != undefined)
    {
        //this statement is triggered if the user once to add a track to a playlist.
        var add_track_url = 'https://api.deezer.com/playlist/'+playlist_id+'/tracks?request_method=POST&access_token='+req.session.access_token;

        var add_track_request = unirest('POST', add_track_url).query('songs='+track_id);
        add_track_request.end((response) => {
            if (response)
            {
            
            }
            else
            {
                res.send("An error occured");
            }
        })
        var music_url = 'https://api.deezer.com/user/me/playlists?access_token='+req.session.access_token;
                var music_request = unirest('GET', music_url);
                music_request.end((music_response) => {
                    if (music_response)
                    {
                        res.render('music_player', {track_id: track_id, access_token: req.session.access_token, access_token_expiration: req.session.access_token_expiration, track_title: track_title, cover_image: cover_image, playlists: music_response.body.data});
                    }
                    else
                    {
                        res.send("An error ocurred");
                    }
                })
    }
    else if (playlist_name != undefined && privacy != undefined)
    {
        //This statement gets triggered if a user once to create a playlist
        var playlist_url = 'https://api.deezer.com/user/me/playlists?request_method=POST&access_token='+req.session.access_token;
        
        var playlist_request = unirest('POST', playlist_url).query('title='+playlist_name);
        playlist_request.end((response) => {
            if (response)
            {
                console.log("Privacy: "+privacy);
                if (privacy == 'Private')
                {
                    var playlist_update_url = 'https://api.deezer.com/playlist/'+response.body.id+"?request_method=POST&access_token="+req.session.access_token;
                    var playlist_update_request = unirest('POST', playlist_update_url).query('public=false');

                    playlist_update_request.end((response_update) => {
                        console.log("dsadsadsa: "+util.inspect(response_update.body, {showHidden: false, depth: null}))
                    })
                }
                var url = 'https://api.deezer.com/user/me/playlists?access_token='+req.session.access_token;
                var url_to_server = 'http://localhost:3003/add_playlist';
                var url_playlist_cover = 'https://api.deezer.com/playlist/'+response.body.id;

                var url_playlist_cover_response = unirest('GET', url_playlist_cover);
                url_playlist_cover_response.end((url_playlist_cover_response) => {
                    var server_response = unirest('POST', url_to_server).send({"playlist_id": response.body.id, "playlist_name": playlist_name, "username": req.session.username, "privacy": privacy, "cover_image": url_playlist_cover_response.body.picture_small});
                    server_response.end((server_response) => {
                    })
                })
                var request_2 = unirest('GET', url);
                request_2.end((response_2) => {
                    if (response_2)
                    {
                        res.render('music_player', {track_id: track_id, access_token: req.session.access_token, access_token_expiration: req.session.access_token_expiration, track_title: track_title, cover_image: cover_image, playlists: response_2.body.data});
                    }
                    else
                    {
                        res.send("An error ocurred");
                    }
                })
            }
        })
    }
    else if (track_id != undefined && track_title != undefined && cover_image != undefined)
    {
        //This statement is triggered if the user is only requesting the music page
        var url = 'https://api.deezer.com/user/me/playlists?access_token='+req.session.access_token;
        var request = unirest('GET', url);
        request.end((response) => {
            if (response)
            {
                res.render('music_player', {track_id: track_id, access_token: req.session.access_token, access_token_expiration: req.session.access_token_expiration, track_title: track_title, cover_image: cover_image, playlists: response.body.data});
            }
            else
            {
                res.send("An error ocurred");
            }
        })
    }
    else
    {
        res.send("An error occured");
    }
})


module.exports = router;