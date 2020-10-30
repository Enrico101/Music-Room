var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.post('/', (req, res) => {
    var playlist_id = req.body.playlist_id;
    var playlist_name = req.body.playlist_name;
    var playlist_creator = req.body.username;
    var privacy = req.body.privacy;
    var cover_image = req.body.cover_image;

    console.log("playlist_id: "+playlist_id);
    console.log("playlist_name: "+playlist_name);
    console.log("playlist_creator: "+playlist_creator);
    console.log("playlist privacy: "+privacy);
    console.log("cover_image: "+cover_image);

    if (playlist_id != undefined && playlist_name != undefined && playlist_creator != undefined && privacy != undefined && cover_image != undefined)
    {
        console.log("Im in");
        db.query("INSERT INTO playlist (id, username, playlist_name, privacy, cover_image) VALUES (?, ?, ?, ?, ?)", [parseInt(playlist_id), playlist_creator, playlist_name, privacy, cover_image], (err, succ) => {
            if (err)
            {
                console.log("errL: "+err);
                res.send(err);
            }
            else if (succ)
            {
                console.log("p2")
                res.send("dplaylist data has been stored");
            }
        })
    }
    else
    {
        res.send("Data not stored");
    }
})

module.exports = router;