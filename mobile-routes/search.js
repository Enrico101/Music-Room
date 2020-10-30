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

//Router ajax search
router.post('/ajax/tracks', (req, res) => {
    var song_name = req.body.song_name;

    if (song_name != undefined)
    {
        var url = "https://api.deezer.com/search?q="+song_name;

        var request = unirest('GET', url);
        request.end((response) => {
            if (response)
            {
                console.log("dsadsa: "+req.session.username);
                res.send(response.body.data);
            }
            else
                res.send("No data found");
        })
    }
    else
    {
        res.send("Song name not defined");
    }
})
module.exports = router;