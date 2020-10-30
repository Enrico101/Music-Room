var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database')
var validator = require('validator');

router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/:username', (req, res) => {
    var username = req.params.username;
    console.log("username: "+username);

    if (username != undefined)
    {
        console.log("Im in p1");
        console.log("server Username: "+username);
        db.query("SELECT * FROM playlist WHERE username != ?", [username], (err, succ) => {
           if (err) throw err;
           console.log("dataset: "+succ);
           if (succ.length > 0)
           {
               res.send(succ);
           }
           else
           {
               res.send("No data found");
           }
        })
    }
    else
    {
        res.send("Unable to retrieve playlist data");
    }
})
router.get('/my_playlist/:username', (req, res) => {
    var username = req.params.username;
    console.log("username: "+username);

    if (username != undefined)
    {
        console.log("Im in p1");
        console.log("server Username: "+username);
        db.query("SELECT * FROM playlist WHERE username = ?", [username], (err, succ) => {
           if (err) throw err;
           console.log("dataset: "+succ);
           if (succ.length > 0)
           {
               res.send(succ);
           }
           else
           {
               res.send("No data found");
           }
        })
    }
    else
    {
        res.send("Unable to retrieve playlist data");
    }
})

module.exports = router;