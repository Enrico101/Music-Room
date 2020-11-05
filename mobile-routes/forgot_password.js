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
    res.render('forgot_password', {});
})
router.post('/', redirectDashboard, (req, res) => {
    var email = req.body.email;

    if (email != undefined)
    {
        if (validator.isEmail(email))
        {
            var transport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "musicroom065",
                    pass: "MusicRoom065@"
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            let mailOptions = {
                from: "musicroom@gmail.com",
                to: email,
                subject: "Click on the link below to reset your password!",
                text: "http://localhost:3002/reset_password"
            }
            transport.sendMail(mailOptions, (err, info) => {
                if (err)
                    res.send(err);
                else
                {
                    console.log("Email sent to: "+email);
                    res.redirect('http://localhost:3002/login');
                }
            });
        }
        else
        {
            res.redirect('http://localhost:3002/forgot_password');
        }
    }
    else
    {
        res.redirect('http://localhost:3002/forgot_password');
    }
})

module.exports = router;