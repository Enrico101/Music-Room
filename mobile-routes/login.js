var express = require('express');
const {redirectLogin, redirectDashboard} = require('./accessControls');
// var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var bcrypt = require('bcrypt-nodejs');
var getmac = require('getmac');
var MacAddress = require('get-mac-address');

var useragent = require('useragent');
console.log("MAC ADDRESS: ", MacAddress);
// console.log(getmac.default());
/////////////////////////////////////////////
const DeviceDetector = require('node-device-detector');
// const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; NX505J Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36';
// const detector = new DeviceDetector;
 
// const result = detector.detect(userAgent);
/////////////////////////////////////////////
router = express.Router();
// router.use(bodyParser.urlencoded({
//     extended: 'true'
// }));

router.get('/', redirectDashboard, (req, res) => {
    const detector = new DeviceDetector;
    console.log("Mac: ", getmac.default());

    console.log('Request useragent: ', req.session.userAgent);
    if (req.session.userAgent !== undefined) {
        const result = detector.detect(req.session.userAgent);
        // console.log('result parse', result);
    }else {
        var agent = useragent.parse(req.headers['user-agent']);
        req.session.userAgent = agent.source;
        console.log('Useragent: ', req.session.userAgent);
        var tmp = agent.source.split("(");
        var tmp2 = tmp[1].split(")");
        var tmp3 = tmp2[0].split(";");
        var brand = tmp3[0];
        var model = tmp3[1];
        console.log("tmp", tmp);
        console.log("tmp2", tmp2);
        console.log("brand", brand);
        console.log("model", model);
        console.log('Useragent: ', req.session.userAgent.split("("));
    }
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
        })
    }
    else
    {
        res.render('/login', {})
    }
})

module.exports = router;