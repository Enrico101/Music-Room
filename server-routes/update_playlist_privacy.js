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
    var privacy = req.body.privacy;

    console.log("playlist_id: "+playlist_id);
    console.log("privacy: "+privacy);

    if (playlist_id != undefined && privacy != undefined)
    {
        db.query("UPDATE playlist SET privacy = ? WHERE id = ?;", [privacy, playlist_id], (err, succ) => {
            if (err)
            {
                console.log("err: "+err);
                res.send("error");
            }
            else
            {
                console.log("succcccccc: "+succ);
                res.send(succ);
            }
        })
    }
    else
    {
        console.log("error");
        res.send("error");
    }
})

module.exports = router;