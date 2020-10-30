var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.post('/', (req, res) => {
    var username_invite = req.body.username_invite;
    var username = req.body.username;
    var access_token = req.body.access_token;
    var playlist_id = req.body.playlist_id;
    var cover_image = req.body.cover_image;
    var playlist_name = req.body.playlist_name;
    var room_name = req.body.room_name;

    console.log("cover_image: "+cover_image);
    console.log("access_token: "+access_token);
    if (username_invite != undefined && username != undefined && access_token != undefined && playlist_id != undefined && cover_image != undefined && room_name != undefined)
    {
        db.query("INSERT INTO playlist_invites (invited_user, playlist_owner, access_token, playlist_id, cover_image, playlist_name, room_name) VALUES (?, ?, ?, ?, ?, ?, ?)", [username_invite, username, access_token, playlist_id, cover_image, playlist_name, room_name], (err, succ) => {
            if (err)
            {
                res.send(err);
            }
            else
                res.send("data posted");
        })
    }
    else
        res.send("missing fields");
})

module.exports = router;