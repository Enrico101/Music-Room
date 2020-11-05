var express = require('express');
const {redirectLogin, redirectDashboard} = require('./accessControls');
// var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var bcrypt = require('bcrypt-nodejs');
var util = require('util');
var getmac = require('getmac');
var MacAddress = require('get-mac-address');

var useragent = require('useragent');
// console.log("MAC ADDRESS: ", MacAddress);
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
    // console.log("Mac: ", getmac.default());
    if (req.session.deviceToken === undefined || req.session.deviceMakeAndModel === undefined) {
        req.session.deviceToken = req.fingerprint.hash;
        req.session.deviceMakeAndModel = req.fingerprint.components.useragent.os;
    }
    // console.log('Request useragent: ', req.session.userAgent);
    if (req.session.userAgent !== undefined) {
        const result = detector.detect(req.session.userAgent);
        // console.log('result parse', result);
    }else {
        var agent = useragent.parse(req.headers['user-agent']);
        req.session.userAgent = agent.source;
        // console.log('Useragent: ', req.session.userAgent);
        var tmp = agent.source.split("(");
        var tmp2 = tmp[1].split(")");
        var tmp3 = tmp2[0].split(";");
        var brand = tmp3[0];
        var model = tmp3[1];
       /*  console.log("tmp", tmp);
        console.log("tmp2", tmp2);
        console.log("brand", brand);
        console.log("model", model);
        console.log('Useragent: ', req.session.userAgent.split("(")); */
    }
    res.render('login');
})

router.post('/verify', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log("req.fingerprint.components.useragent.os ::: ", req.fingerprint.components.useragent.os.family + " " + req.fingerprint.components.useragent.os.major)
    if(validator.isEmpty(username) == false && validator.isEmpty(password) == false)
    {
        var request = unirest('GET', 'http://localhost:3003/api/verifyUser').send({"username": username, "password": password, "uniqueToken": req.fingerprint.hash, "deviceOS": req.fingerprint.components.useragent.os.family + " " + req.fingerprint.components.useragent.os.major});

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
                    console.log("Results: ", req.session.userInfo.results.lenght);
                    if (req.session.userInfo.results.length !== 0)
                        req.session.photo = req.session.userInfo.results[0].imagePath;
                    
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