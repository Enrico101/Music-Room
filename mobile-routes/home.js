var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');

router = express.Router();
var secretString = Math.floor((Math.random() * 10000) + 1);
router.use(session({
    secret: secretString.toString(),
    resave: true,
    saveUninitialized: true
}));
router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    var myEventEmitter = req.app.get('myEventEmitter'); //Getting the same event emitter instance from the mobileApp.js
    var url = "https://api.deezer.com/chart/0/tracks";
    var url_2 = "https://api.deezer.com/chart/0/albums";
    
    var request = unirest('GET', url);
    var request_2 = unirest('GET', url_2);

    request.end((response) => {
        if (response)
        {
            var io = req.app.get('io');
            io.on('connection', (socket) => {
                socket.emit('FoundTopTracks', response.body);
            })
            //console.log("Found something");
            //myEventEmitter.emit('FoundTopTracks', response.body);
        }
    })
    request_2.end((response) => {
        if (response)
        {
            var io = req.app.get('io');
            io.on('connection', (socket) => {
                socket.emit('FoundTopAlbums', response.body);
            })
            //console.log("Found something");
            //myEventEmitter.emit('FoundTopTracks', response.body);
        }
    })
    res.render('home');
})

module.exports = router;