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
        res.render('search');
})

router.get('/results', (req, res) => {
    var musicSearch = req.query.search_request;

    if (musicSearch != undefined)
    {
        console.log("musicSearch: "+musicSearch);
        var request, request_2;
        var url = "https://api.deezer.com/search/album?q="+musicSearch;
        var url_2 = "https://api.deezer.com/search/track?q="+musicSearch;

        request = unirest('GET', url);
        request_2 = unirest('GET', url_2);

        request.end((response) => {
            request_2.end((response_2) => {
                res.render('searchResults', {albums: response.body, songs: response_2.body});
            })
        })
    }
    else
        res.render('search');
})
module.exports = router;