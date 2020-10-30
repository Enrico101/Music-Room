var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    db.query("select * from playlist_invites", (err, succ) => {
        if (err)
            res.send('error');
        else
            res.send(succ);
    })
})

module.exports = router;