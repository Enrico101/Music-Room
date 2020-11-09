var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var util = require('util');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.post('/', (req, res) => {
    var password = req.body.password;
    var email = req.body.email;

    console.log("password: "+password);
    console.log("email: "+email);
    if (password != undefined && email != undefined)
    {
        db.query("UPDATE users SET password = ? WHERE email = ?", [password, email], (err, succ) => {
            if (err)
            {
                console.log("err: "+err);
                res.send("error");
            }
            else
            {
                console.log("lookdsadsa: "+util.inspect(succ));
                res.send("success");
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