var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database');
const {conInit, con } = require('../config/connection');
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var router = require('../mobile-routes/settings');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    
})

module.exports = router;