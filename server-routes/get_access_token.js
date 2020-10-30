var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/:playlist_owner', (req, res) => {
    var owner = req.params.playlist_owner;

    if (owner != undefined)
    {
        db.query("SELECT * FROM users WHERE username = ?", [owner], (err, succ) => {
            if (err)
                res.send("error");
            else if (succ.length > 0)
            {
                res.send(succ[0].access_token);
            }
            else
            {
                res.send("error");
            }
        })
    }
})

module.exports = router;