var express = require('express');
const {redirectLogin, redirectDashboard} = require('./accessControls');
// var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');

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
                    var app_id = process.env.APP_ID;
                    var redirect_uri = process.env.REDIRECT_URI;
                    var url = "https://connect.deezer.com/oauth/auth.php?app_id="+app_id+"&redirect_uri="+redirect_uri+"&perms=basic_access,email,offline_access,manage_library";
                    res.redirect(url);
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