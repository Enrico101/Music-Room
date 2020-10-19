var express = require('express');
var bodyParser = require('body-parser');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const unirest = require('unirest');
const validator = require('validator');
const path = require('path');
const multer  = require('multer');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    // destination: './public/uploads',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //   cb(null, file.fieldname + '-' + uniqueSuffix)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

router.get('/', redirectLogin, (req, res) => {
    let user = req.session;
    res.render('settings', {
        data: user,
        defaultView: 'View Profile',
        error: false,
        info: undefined
    });
})

router.get('/view-profile', redirectLogin, (req, res) => {
    let user = req.session;
    res.render('settings', {
        data: user,
        defaultView: 'View Profile',
        error: false,
        info: undefined
    });
})

router.get('/edit-profile', redirectLogin, (req, res) => {
    let user = req.session;
    res.render('settings', {
        data: user,
        defaultView: 'Edit Profile',
        error: false,
        info: undefined
    });
})

router.get('/change-password', redirectLogin, (req, res) => {
    let user = req.session;
    res.render('settings', {
        data: user,
        defaultView: 'Change Password',
        error: false,
        info: undefined
    });
})

router.post('/username', (req, res) => {
    let username = req.body.username;
    if(validator.isEmpty(username) == false && validator.isAlpha(username)) {
        var request = unirest('GET', 'http://localhost:3003/settings/username').send({"username": username, "id": req.session.userId});
    
        request.end((response) => {
            if (response)
            {
                if (response.body == 'Username has been successfully updated') 
                {
                    req.session.username = username;
                    res.render('settings', {info: "Username has been successfully updated.", data: req.session, defaultView: 'View Profile', error: false});
                }
                else if (response.body == "Username field is empty")
                {
                    res.render('settings', {info: "Username field is empty.", data: req.session, defaultView: 'Edit Profile', error: true});
                }
                else if (response.body == "Username already exists")
                {
                    res.render('settings', {info: "Username already exists.", data: req.session, defaultView: 'Edit Profile', error: true});
                }
            }
            else
            {
                res.render('settings', {info: "An unkown error occured.", data: req.session, defaultView: 'Edit Profile', error: true});
            }
        })

    }else
        return  res.render('settings', {info: "Username field is empty. Username must be alphabetic.", data: req.session, defaultView: 'Edit Profile', error: true});
})

router.post('/email', (req, res) => {
    let email = req.body.email;
    if(validator.isEmpty(email) == false && validator.isEmail(email) == true) {
        var request = unirest('GET', 'http://localhost:3003/settings/email').send({"email": email, "id": req.session.userId});
    
        request.end((response) => {
            if (response)
            {
                if (response.body == 'email has been successfully updated') 
                {
                    req.session.email = email;
                    res.render('settings', {info: "email has been successfully updated.", data: req.session, defaultView: 'View Profile', error: false});
                }
                else if (response.body == "email field is empty")
                {
                    res.render('settings', {info: "email field is empty.", data: req.session, defaultView: 'Edit Profile', error: true});
                }
                else if (response.body == "email already exists")
                {
                    res.render('settings', {info: "email already exists.", data: req.session, defaultView: 'Edit Profile', error: true});
                }
            }
            else
            {
                res.render('settings', {info: "An unkown error occured.", data: req.session, defaultView: 'Edit Profile', error: true});
            }
        })

    }else
        return  res.render('settings', {info: "Email field is empty.", data: req.session, defaultView: 'Edit Profile', error: true});
})

function checker(password, fieldName){
    if (!validator.isEmpty(password) && validator.isAlphanumeric(password) && validator.isByteLength(password, {min: 6, max: 50})) {
        return {bool: true, reason: ""};
    }else {
        if (validator.isEmpty(password))
            return {bool: false, reason: `${fieldName}: Password field is empty.`};
        else if (!validator.isAlphanumeric(password))
            return {bool: false, reason: `${fieldName}: Password must be alphanumeric.`};
        else
            return {bool: false, reason: `${fieldName}: Password must have a minimum of 6 characters.`};
    }
}

router.post('/password', (req, res) => {
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let confPassword = req.body.confPassword;
    console.log("This is bcrypt: " +bcrypt.compareSync(oldPassword, req.session.password));
    var tmpArray = [];
    if (checker(oldPassword, 'Old Password').bool === true && checker(newPassword, 'New Password').bool === true && checker(confPassword, 'Confirm Password').bool === true) {
        if (newPassword === confPassword) {
            console.log(newPassword);
            console.log(confPassword);

            var salt_rounds = 5;
            var salt = bcrypt.genSaltSync(salt_rounds);
            var hash = bcrypt.hashSync(newPassword, salt);
            var request = unirest('GET', 'http://localhost:3003/settings/password').send({"username": req.session.username, "oldPassword": oldPassword, "sessPass": req.session.password, "password": hash, "id": req.session.userId});

            request.end((response) => {
                if (response)
                {
                    if (response.body == 'Password has been successfully updated') 
                    {
                        req.session.password = hash;
                        res.render('settings', {info: "Password has been successfully updated.", data: req.session, defaultView: 'View Profile', error: false});
                    }
                    else if (response.body == "An error has occured")
                    {
                        res.render('settings', {info: "An error has occured.", data: req.session, defaultView: 'Change Password', error: true});
                    }else if (response.body == "Old password does not match.")
                    {
                        res.render('settings', {info: "Old password does not match.", data: req.session, defaultView: 'Change Password', error: true});
                    }
                }
                else
                {
                    res.render('settings', {info: "An unkown error occured.", data: req.session, defaultView: 'Change Password', error: true});
                }
            })

        }else {
            tmpArray[0] = 'New Password does not match Confirm Password.';
            return  res.render('settings', {info: tmpArray, data: req.session, defaultView: 'Change Password', error: true});
        }
    }else {
        for (let index = 0; index < 3; index++) {
            if (checker(oldPassword, 'Old Password').bool === false && index == 0)
                tmpArray[index] = checker(oldPassword, 'Old Password').reason;
            else if (checker(newPassword, 'New Password').bool === false  && index == 1)
                tmpArray[index] = checker(newPassword, 'New Password').reason;
            else if (checker(confPassword, 'Confirm Password').bool === false  && index == 2)
                tmpArray[index] = checker(confPassword, 'Confirm Password').reason;
        }
        return  res.render('settings', {info: tmpArray, data: req.session, defaultView: 'Change Password', error: true});
    }
})

router.post('/set-profilePic', (req, res) => {

})

module.exports = router;