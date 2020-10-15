var express = require('express');
var bodyParser = require('body-parser');


var router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', (req, res) => {
    res.render('channel');
})

module.exports = router;