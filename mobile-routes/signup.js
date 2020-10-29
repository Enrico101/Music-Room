var express = require('express');
// var bodyParser = require('body-parser');
var app = express();
const {redirectLogin, redirectDashboard} = require('./accessControls');
var userRegistrationClass = require('../mobile-classes/userRegistration');
var unirest = require('unirest');
// var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');


router = express.Router();



// router.use(bodyParser.urlencoded({
//     extended: 'true'
// }));


router.get('/', redirectDashboard, (req, res) => {
    global.CURRENT_PAGE = 'signup';
    res.render('signup');
})
router.post('/', (req, res) => {
    var userRegistration = new userRegistrationClass(req.body.username, req.body.email, req.body.emailConfirm, req.body.password);

    var userRegistrationResults = userRegistration.validate();
    if (userRegistrationResults.bool == true)
    {
        var salt_rounds = 5;
        var salt = bcrypt.genSaltSync(salt_rounds);
        var hash = bcrypt.hashSync(userRegistration.password, salt);
        var request = unirest('POST', 'http://localhost:3003/newUser').send({"username": userRegistration.username, "email": userRegistration.email, "password": hash, "access_token": "Not_set"});

        request.end((response) => {
            if (response)
            {
                if (response.body == 'Successfully added user to database')
                    res.render('login', {info: "user signed up"});
                else if (response.body == "One of the fields are empty")
                {
                    res.render('signup', {signupInfo: "missing fields"});
                }
                else if (response.body == "Username already exists")
                {
                    res.render('signup', {signupInfo: "Username already exists"});
                }
                else if (response.body == "Email already exists")
                {
                    res.render("signup", {signupInfo: "Email already exists"})
                }
            }
            else
            {
                res.render('signup', {signupInfo: "An unkown error occured"});
            }
        })
    }
    else
    {
        res.render('signup', {signupInfo: userRegistrationResults.reason});
    }
})


module.exports = router;