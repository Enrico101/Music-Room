var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../database');

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    var uniqueToken = req.body.uniqueToken;
    var deviceOS = req.body.deviceOS;
    var username = req.body.username;
    db.query('SELECT * FROM deviceManager WHERE username = ? AND deviceToken = ? LIMIT 1', [username, uniqueToken], (err, result) => {
        if (err) return res.send("An error has occured");
        db.query('DELETE FROM deviceManager WHERE username = ? AND deviceToken = ?', [username, uniqueToken], (err, data) => {
            if (err) return res.send("An error has occured");
            return res.send('You have made changes to the database.');
        })
    })
});

module.exports = router;