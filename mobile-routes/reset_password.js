var express = require('express');
const {redirectLogin, redirectDashboard} = require('./accessControls');
var useragent = require('useragent');
var unirest = require('unirest');
var validator = require('validator');
const nodemailer = require("nodemailer");
var bodyParser = require('body-parser');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', redirectDashboard, (req, res) => {
    res.render('reste_password', {});
})

router.post('/', redirectDashboard, (req, res) => {
    var password = req.body.password;
    var email = req.body.email;

    if (password != undefined && email != undefined)
    {
        if (validator.isAlphanumeric(password) && validator.isByteLength(password, {min: 6, max: 50}) && validator.isEmail(email))
        {
            var salt_rounds = 5;
            var salt = bcrypt.genSaltSync(salt_rounds);
            var hash = bcrypt.hashSync(userRegistration.password, salt);

            var url = 'http://localhost:3003/api/post_new_password';
            var request = unirest('POST', url).send({"password": hash, "email": email});
            request.end((response) => {

            })
        }
    }
})