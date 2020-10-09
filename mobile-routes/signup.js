var express = require('express');
var bodyParser = require('body-parser');
var userRegistrationClass = require('../mobile-classes/userRegistration');
var unirest = require('unirest');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    res.render('signup');
})
router.post('/', (req, res) => {
    var userRegistration = new userRegistrationClass(req.body.username, req.body.email, req.body.emailConfirm, req.body.password);

    console.log("username: "+req.body.username)
    var userRegistrationResults = userRegistration.validate();
    console.log("see: "+userRegistrationResults.bool);
    if (userRegistrationResults.bool == true)
    {

        console.log("im here");
        var request = unirest('POST', 'http://localhost:3003/newUser').send({"username": userRegistration.username, "email": userRegistration.email, "password": userRegistration.password});

        request.end((response) => {
            if (response)
            {
                console.log(response.body);
                res.render('login');
            }
        })
    }
    else
    {
        res.render('signup', {});
    }
})

module.exports = router;