var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');
var unirest = require('unirest');
var util = require('util');
const { response } = require('express');

router = express.Router();

router.post('/', (req, res) => {
    var playlist_id = req.body.playlist_id;

    if (playlist_id != undefined)
    {
        var url = 'http://localhost:3003/api/get_rights';
        
        var request = unirest("POST", url).send({"playlist_id": playlist_id});
        request.end((response) => {
            console.log("ksjdkjdkljasdjhkjkds: "+response.body);
            if (response.body != 'error')
            {
                res.send(response.body);
            }
            else
            {
                res.send("error");
            }
        })
    }
    else
    {
        res.send("error");
    }
})

module.exports = router;