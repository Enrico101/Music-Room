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
        if (privacy == "true")
        {
            var playlist_update_request = unirest('POST', playlist_update_url).query('public=true');

            playlist_update_request.end((response_update) => {
                console.log("dsadsadsa: "+util.inspect(response_update.body, {showHidden: false, depth: null}))
                res.send("success");
            })
        }
        else if (privacy == "false")
        {
            var playlist_update_request = unirest('POST', playlist_update_url).query('public=false');

            playlist_update_request.end((response_update) => {
                console.log("dsadsadsa: "+util.inspect(response_update.body, {showHidden: false, depth: null}))
                res.send("success");
            })
        }
    }
})

module.exports = router;