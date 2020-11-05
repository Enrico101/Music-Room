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

router.post('/', (req, res) => {
    var username = req.body.username;
    var owner_of_playlist = req.session.username;
    var access_token = req.session.access_token;
    var playlist_id = req.body.playlist_id;
    var playlist_name = req.body.playlist_name;
    var cover_image = req.body.cover_image;
    var room_name = req.body.room_name;

    console.log("cover_image: ")
    if (username != undefined && owner_of_playlist != undefined && access_token != undefined && playlist_id != undefined && playlist_name != undefined && cover_image != undefined && room_name != undefined)
    {
        var url = 'http://localhost:3003/api/get_playlist_invites';

        var request = unirest('GET', url);
        request.end((response) => {
            if (response.body != 'error')
            {
                var x = 0;
                var data = response.body;
                var invite_exists = false;
                
                while (data[x])
                {
                    if (data[x].invited_user == username && data[x].id == playlist_id)
                    {
                        invite_exists = true;
                        break;
                    }
                    x++;
                }
                if (invite_exists == true)
                {
                    res.send('User already exists');
                }
                else
                {
                    var url_2 = 'http://localhost:3003/api/post_playlist_invite';

                    var request_2 = unirest('POST', url_2).send({"playlist_id": playlist_id, "username_invite": username, "username": owner_of_playlist, "access_token": access_token, "cover_image": cover_image, "playlist_name": playlist_name, "room_name": room_name});
                    request_2.end((response_2) => {
                        if (response_2.body == "data posted")
                        {
                            res.send("success");
                        }
                        else
                        {
                            res.send(response_2.body);
                        }
                    })
                }
            }
            else
            {
                res.send(response.body);
            }
        })
    }
    else
        res.send(response.body);
})

module.exports = router;