var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../database');

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    var username = req.body.username;
    db.query("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err)
            res.send("An error has occured in Users");
        else if (user.length > 0)
        {
            db.query("SELECT * FROM images WHERE username = ? LIMIT 1", [username], (err, results) => {
                if (err)
                    res.send("An error has occured in Images");
                res.send({user, results});
            })
        }
        else
        {
            res.send("No user found");
        }
    })
});

module.exports = router;