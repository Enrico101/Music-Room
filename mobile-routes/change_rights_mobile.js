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
    var rights = req.body.rights;
    console.log("landed in route with this info: "+playlist_id+" : "+rights);
    if (playlist_id != undefined && rights != undefined)
    {
        if (rights == "add_remove")
        {
            var url = 'http://localhost:3003/api/change_rights'

            var request = unirest('POST', url).send({"rights_update": "add", "playlist_id": playlist_id});
            request.end((response) => {
                if (response.body != 'error')
                {
                    res.send("add");
                }
                else
                {
                    res.send('error');
                }
            })
        }
        else if (rights == "add")
        {
            var url = 'http://localhost:3003/change_rights'

            var request = unirest('POST', url).send({"rights_update": "remove", "playlist_id": playlist_id});
            request.end((response) => {
                if (response.body != 'error')
                {
                    if (response.body != 'error')
                    {
                        res.send("remove");
                    }
                    else
                    {
                        res.send('error');
                    }
                }
                else
                {
                    res.send('error');
                }
            })
        }
        else if (rights == "remove")
        {
            var url = 'http://localhost:3003/change_rights'

            var request = unirest('POST', url).send({"rights_update": "add_remove", "playlist_id": playlist_id});
            request.end((response) => {
                if (response.body != 'error')
                {
                    res.send("add_remove")
                }
                else
                {
                    res.send('error');
                }
            })
        }
    }
    else
    {

    }
})

module.exports = router;