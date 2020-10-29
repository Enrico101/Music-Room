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
        
    });
    res.render('index');
})

module.exports = router;