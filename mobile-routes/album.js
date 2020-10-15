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

router.get('/:id', (req, res) => {
    if (req.params.id != undefined)
    {
        var request, request_2;
        var url = "https://api.deezer.com/album/"+req.params.id+"/tracks";
        var image_url = "https://api.deezer.com/album/"+req.params.id;

        request = unirest('GET', url);
        request_2 = unirest('GET', image_url);
        request.end((response) => {
            request_2.end((response_2) => {
                if (response || response_2)
                {
                    res.render('album', {album_name: response_2.body.title, album_image: response_2.body.cover_medium, album_songs: response.body})
                }
                else
                {
                    res.redirect('/search');
                }
            })
        })
    }
    else
        res.redirect('/search');
})

module.exports = router;