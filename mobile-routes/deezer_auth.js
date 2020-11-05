var express = require('express');
// var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var dotenv = require('dotenv');

dotenv.config();

router = express.Router();

// router.use(bodyParser.urlencoded({
//     extended: 'true'
// }));

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
            var url_2 = "https://developers.deezer.com/api/explorer?url=user/me?access_token=";
            var url_3 = "http://localhost:3003/api/post_access_token";

            var request = unirest('GET', url);
            request.end((response) => {
                var access_token_1 = response.body.split('=');
                var access_token_expiration = access_token_1[2];
                var access_token_2 = access_token_1[1].split('&');
                var access_token = access_token_2[0];
                req.session.access_token = access_token;
                req.session.access_token_expiration = access_token_expiration;
                var request_3 = unirest('POST', url_3).send({"access_token": access_token, "username": req.session.username});
                request_3.end((response_3) => {

                })
                req.session.userId = 1;
                var request_2 = unirest('GET', url_2+access_token);
                request_2.end((response_2) => {
                    req.session.userDeezerId = response_2.body.id;
                    res.redirect('/home');
                })
               /* req.session.access_token = response.body;
                res.redirect('/home'); */
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