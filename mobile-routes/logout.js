const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');
var unirest = require('unirest');

router.get('/', redirectLogin,  (req, res) => {
    let username = req.session.username;
    console.log("SUPER USER: ",username)
    req.session.destroy( (err) => {
        if (err) return res.redirect('/home');
        var request = unirest('GET', 'http://localhost:3003/api/deleteDevice').send({"uniqueToken": req.fingerprint.hash, "deviceOS": req.fingerprint.components.useragent.os.family + " " + req.fingerprint.components.useragent.os.major, "username": username});

        request.end((response) => {
            if (response) {
                if (response.body == 'You have made changes to the database.') {
                    res.clearCookie(process.env.SESS_NAME);
                    return res.redirect('/login');
                }else if (response.body == 'An error has occured') {
                    return res.redirect('/home');
                }
            }
        });
    });
});

module.exports = router;