var express = require('express');
// var bodyParser = require('body-parser');
var db = require('../database');
const {redirectLogin, redirectDashboard} = require('./accessControls');
var validator = require('validator');
var unirest = require('unirest');

router = express.Router();
// router.use(bodyParser.urlencoded({
//     extended: 'true'
// }));

router.get('/', redirectLogin, (req, res) => {
    res.render('search');
})

module.exports = router;