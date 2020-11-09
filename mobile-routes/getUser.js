var express = require('express');
const {redirectLogin, redirectDashboard} = require('./accessControls');
var useragent = require('useragent');
var unirest = require('unirest');
const { route } = require('./settings');

router = express.Router();

router.get('/:username', (req, res) => {
    var username = req.params.username;
    var request = unirest('GET', 'http://localhost:3003/api/getUsers').send({"uniqueToken": req.fingerprint.hash, "deviceOS": req.fingerprint.components.useragent.os, "username": username});

    request.end((response) => {
        if (response) {
            if (response.body == "An error has occured in Users") {
                req.session.deviceToken = req.fingerprint.hash;
                req.session.deviceMakeAndModel = req.fingerprint.components.useragent.os;
                return res.render('login');
            } else if (response.body == "An error has occured in Images") {
                req.session.deviceToken = req.fingerprint.hash;
                req.session.deviceMakeAndModel = req.fingerprint.components.useragent.os;
                return res.render('login');
            } else if (req.body == "No user found") {
                req.session.deviceToken = req.fingerprint.hash;
                req.session.deviceMakeAndModel = req.fingerprint.components.useragent.os;
                return res.render('login');
            } else {
                req.session.userInfo = response.body;
                req.session.userId = req.session.userInfo.user[0].id;
                req.session.username = req.session.userInfo.user[0].username;
                req.session.email = req.session.userInfo.user[0].email;
                req.session.password = req.session.userInfo.user[0].password;
                // req.session.photo = req.session.userInfo.results[0].imagePath;
                if (req.session.userInfo.results.length !== 0)
                    req.session.photo = req.session.userInfo.results[0].imagePath;
                req.session.deviceToken = req.fingerprint.hash;
                req.session.deviceMakeAndModel = req.fingerprint.components.useragent.os;
                var ip = res.socket.remoteAddress;
                var port = res.socket.remotePort;

                console.log("Socket ip: " + ip);
                console.log("Socket port: " + port);
                if (req.session.userInfo.user[0].access_token == '' || req.session.userInfo.user[0].access_token == "Not_set")
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
                    req.session.userId = req.session.userInfo.user[0].id;
                    req.session.access_token = req.session.userInfo.user[0].access_token;
                    req.session.access_token_expiration = '0';
                    var url_2 = "https://developers.deezer.com/api/explorer?url=user/me?access_token=";
                    var request_2 = unirest('GET', url_2+req.session.access_token);
                    request_2.end((response_2) => {
                        // req.session.userDeezerId = response_2.body.id;
                        res.redirect('/home');
                    })              
                }
                //-----------------------------------------
            }
        }
    });
    console.log(username)

})

module.exports = router;