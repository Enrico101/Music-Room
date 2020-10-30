var express = require('express');
const {redirectLogin, redirectDashboard} = require('./accessControls');
// var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var bcrypt = require('bcrypt-nodejs');
var util = require('util');

router = express.Router();
// router.use(bodyParser.urlencoded({
//     extended: 'true'
// }));

router.get('/', redirectDashboard, (req, res) => {
    global.CURRENT_PAGE = 'login';
    res.render('login');
})

router.post('/verify', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    if(validator.isEmpty(username) == false && validator.isEmpty(password) == false)
    {
        var request = unirest('GET', 'http://localhost:3003/verifyUser').send({"username": username, "password": password});

        request.end((response) => {
            if (response)
            {
                if (response.body == "Incorrect password")
                {
                    res.render('login', {info: "Incorrect password"})
                }
                else if (response.body == "No user found")
                {
                    res.render('login', {info: "No user found"})
                }
                else
                {
                    req.session.userInfo = response.body;
                    req.session.userId = req.session.userInfo[0].id;
                    req.session.username = req.session.userInfo[0].username;
                    req.session.email = req.session.userInfo[0].email;
                    req.session.password = req.session.userInfo[0].password;
                    
                    if (response.body[0].access_token == '' || response.body[0].access_token == "Not_set")
                    {
                        req.session.isOauth = false;
                        var app_id = process.env.APP_ID;
                        var redirect_uri = process.env.REDIRECT_URI;
                        var url = "https://connect.deezer.com/oauth/auth.php?app_id="+app_id+"&redirect_uri="+redirect_uri+"&perms=basic_access,email,offline_access,manage_library,delete_library";
                        res.redirect(url);
                    }
                    else
                    {
                        req.session.isOauth = false;
                        req.session.userId = 1;
                        req.session.access_token = response.body[0].access_token;
                        req.session.access_token_expiration = '0';
                        var url_2 = "https://developers.deezer.com/api/explorer?url=user/me?access_token=";
                        var request_2 = unirest('GET', url_2+req.session.access_token);
                        request_2.end((response_2) => {
                            req.session.userDeezerId = response_2.body.id;
                            res.redirect('/home');
                        })              
                    }
                    //-----------------------------------------
                }
            }
        })
    }
    else
    {
        res.render('/login', {})
    }
})

module.exports = router;