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
                        res.send({user, results});
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