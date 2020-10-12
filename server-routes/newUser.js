var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.post('/', (req, res) => {
    console.log(req.body);
    if (validator.isEmpty(req.body.username) == false && validator.isEmpty(req.body.email) == false && validator.isEmpty(req.body.password) == false)
    {
        db.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, email) => {
            if (err)
            {
                res.send("An error occured!");
            }
            else if (email.length > 0)
            {
                res.send("Email already exists");
            }
            else
            {
                db.query("SELECT * FROM users WHERE username = ?", [req.body.username], (err, username) => {
                    if (err)
                        console.log(err);
                    else if (username.length > 0)
                        res.send("Username already exists");
                    else
                    {
                        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [req.body.username, req.body.email, req.body.password], (err, succ) => {
                            if (err)
                                res.send("An error has occured!");
                            else
                                res.send("Successfully added user to database");
                        })
                    }
                })
            }
        })
    }
    else
        res.send("One of the fields are empty");
})

module.exports = router;