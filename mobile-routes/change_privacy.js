var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var util = require('util');
const { response } = require('express');

router = express.Router();

router.post('/', (req, res) => {
    var playlist_id = req.body.playlist_id;
    var privacy = req.body.privacy;

    console.log("playalits_iddssa: "+req.body.playlist_id);
    console.log("privacydsadsa: "+req.body.privacy);
    if (playlist_id != undefined && privacy != undefined)
    {
        var playlist_update_url = 'https://api.deezer.com/playlist/'+playlist_id+"?request_method=POST&access_token="+req.session.access_token;
        var playlist_privacy_server_update_url = 'http://localhost:3003/api/post_playlist_privacy';

        if (privacy == "true")
        {
            var playlist_update_request = unirest('POST', playlist_update_url).query('public=true');
            var playlist_privacy_server_update_response = unirest('POST', playlist_privacy_server_update_url).send({playlist_id: playlist_id, privacy: 'Public'});

            playlist_update_request.end((response_update) => {
                playlist_privacy_server_update_response.end((response_from_server) => {
                    if (response_from_server != 'error')
                    {
                        //console.log("dsadsadsa: "+util.inspect(response_update.body, {showHidden: false, depth: null}))
                        console.log("succ");
                        res.send("success");
                    }
                    else
                    {
                        console.log("error");
                    }
                })
            })
        }
        else if (privacy == "false")
        {
            var playlist_update_request = unirest('POST', playlist_update_url).query('public=false');
            var playlist_privacy_server_update_response = unirest('POST', playlist_privacy_server_update_url).send({playlist_id: playlist_id, privacy: 'Private'});

            playlist_update_request.end((response_update) => {
                playlist_privacy_server_update_response.end((response_from_server) => {
                    if (response_from_server != 'error')
                    {
                        //console.log("dsadsadsa: "+util.inspect(response_update.body, {showHidden: false, depth: null}))
                        console.log("succ");
                        res.send("success");
                    }
                    else
                    {
                        console.log("error");
                    }
                })
            })
        }
    }
})

module.exports = router;