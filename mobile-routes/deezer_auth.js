var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');

router = express.Router();
var secretString = Math.floor((Math.random() * 10000) + 1);
router.use(session({
    secret: secretString.toString(),
    resave: true,
    saveUninitialized: true
}));
router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    var deezer_code = req.query.code;
    var deezer_error = req.query.error_reason;

    if (deezer_error == undefined)
    {
        console.log("p1");
        if (deezer_code != undefined)
        {
            console.log("p2");
            var app_id = process.env.APP_ID;
            var secret = process.env.SECRET_KEY;
            var url = "https://connect.deezer.com/oauth/access_token.php?app_id="+app_id+"&secret="+secret+"&code="+deezer_code;
            
            var request = unirest('GET', url);
            request.end((response) => {
                req.session.access_token = response.body;
                res.redirect('/home');
            })
        }
        else
        {
            res.redirect('/login');
        }
    }
    else
    {
        res.redirect('login');
    }
})

router.post('/', (req, res) => {

})

module.exports = router;