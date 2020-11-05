var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.post('/', (req, res) => {
    var playlist_id = req.body.playlist_id;
    var rights = req.body.rights;

    if (playlist_id != undefined && rights != undefined)
    {
        db.query("UPDATE playlist SET playlist_rights = ? WHERE id = ?", [rights, playlist_id], (err, succ) => {
            if (err)
                res.send("error");
            else
                res.send("success");
        })
    }
    else
    {
        res.send("error");
    }
})

module.exports = router;