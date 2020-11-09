var express = require('express');
const {redirectLogin, redirectDashboard} = require('./accessControls');
var useragent = require('useragent');
var unirest = require('unirest');

router = express.Router();

router.get('/', (req, res) => {
    let user = req.session;
    res.render('verifyUsersData', {
        data: user,
        users: undefined
    });
});

module.exports = router;