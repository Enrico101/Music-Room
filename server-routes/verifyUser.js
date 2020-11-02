var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var deviceToken = req.body.uniqueToken;
    var deviceOS = req.body.deviceOS;

    if (validator.isEmpty(username) == false && validator.isEmpty(password) == false)
    {
        db.query("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
            if (err)
                res.send("An error has occured");
            else if (user.length > 0)
            {
                console.log("bcrypt results: "+bcrypt.compareSync(password, user[0].password));
                // console.log("Password: "+password);
                if (bcrypt.compareSync(password, user[0].password))
                {
                    db.query("SELECT * FROM images WHERE username = ? LIMIT 1", [username], (err, results) => {
                        if (err)
                            res.send("An error has occured");
                        db.query("SELECT * FROM deviceManager WHERE deviceToken = ? AND username = ? LIMIT 1", [deviceToken, username], (err, data) => {
                            if (err) return res.send("An error has occured");
                            if (data.length !== 0) {
                                return res.send({user, results, data});
                            } else {
                                db.query("INSERT INTO deviceManager (username, deviceToken, deviceMakeAndModel) VALUES (?, ?, ?)", [username, deviceToken, deviceOS], (err, devInfo) => {
                                    if (err) return res.send("An error has occured");
                                    return res.send({user, results});
                                })
                            }
                        })
                    })
                }
                else
                {
                    res.send("Incorrect password");
                }
            }
            else
            {
                res.send("No user found");
            }
        })
    }
})

module.exports = router;