var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.post('/', (req, res) => {
    var access_token = req.body.access_token;
    var username = req.body.username;

    if (access_token != undefined && username != undefined)
    {
        db.query("UPDATE users SET access_token = ? WHERE username = ?", [access_token, username], (err, succ) => {
            if (err)
                res.send(err);
            else
            {
                res.send("Updated access token");
            }
        })
    }
    else
    {
        res.send("There are missing fields");
    }
})

module.exports = router;