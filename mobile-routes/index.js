var express = require('express');
const {redirectLogin, redirectDashboard} = require('./accessControls');
var useragent = require('useragent');
var unirest = require('unirest');

router = express.Router();

router.get('/', redirectDashboard, (req, res) => {
    var agent = useragent.parse(req.headers['user-agent']);
    req.session.userAgent = agent.source;
    console.log(req.fingerprint);
    // console.log("User Agent: ", req.fingerprint.components.geoip);
    var request = unirest('GET', 'http://localhost:3003/checkUser').send({"uniqueToken": req.fingerprint.hash, "deviceOS": req.fingerprint.components.useragent.os});

    request.end((response) => {
        if (response) {
            if (response.body == 'An error has occured in Device Manager') {

            } else if (response.body == 'An error has occured in Users') {

            } else if (response.body == 'An error has occured in Images') {

            } else {
                req.session.userInfo = response.body;
                req.session.userId = req.session.userInfo.user[0].id;
                req.session.username = req.session.userInfo.user[0].username;
                req.session.email = req.session.userInfo.user[0].email;
                req.session.password = req.session.userInfo.user[0].password;
                req.session.photo = req.session.userInfo.results[0].imagePath;
                var ip = res.socket.remoteAddress;
                var port = res.socket.remotePort;

                console.log("Socket ip: " + ip);
                console.log("Socket port: " + port);
                req.session.isOauth = false;
                var app_id = process.env.APP_ID;
                var redirect_uri = process.env.REDIRECT_URI;
                var url = "https://connect.deezer.com/oauth/auth.php?app_id="+app_id+"&redirect_uri="+redirect_uri+"&perms=basic_access,email,offline_access,manage_library";
                res.redirect(url);
                //-----------------------------------------
            }
        }
    });
    res.render('index');
})

module.exports = router;