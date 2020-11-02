var express = require('express');
var bodyParser = require('body-parser');


var router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    var cache_expire = 60*60*24*365;
    res.setHeader("Pragma", "public");
    res.setHeader("Cache-Control", "public, max-age="+cache_expire);
    res.setHeader("Expires", new Date(Date.now() + cache_expire).toUTCString());
    res.render('channel');
})

module.exports = router;