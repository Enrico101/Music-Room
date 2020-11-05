var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/:playlist_id', (req, res) => {
    var playlist_id = req.params.playlist_id;
    console.log("playlist_id: "+playlist_id);

    if (playlist_id != undefined)
    {
        db.query("SELECT * FROM playlist WHERE id = ?", [playlist_id], (err, succ) => {
            if (err)
                console.log(err);
            else if (succ.length > 0)
                res.send(succ[0].playlist_rights);
        })
    }
    else
    {
        res.send("Unable to retrieve playlist rights");
    }
})

module.exports = router;