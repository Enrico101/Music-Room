var express = require('express');
var bodyParser = require('body-parser');
const {redirectLogin, redirectDashboard} = require('./accessControls');


var router = express.Router();

router.use(bodyParser.urlencoded({
    extended: 'true'
}));

router.get('/', redirectLogin, (req, res) => {
    res.render('settings');
})

router.post('/', (req, res) => {
    
})

module.exports = router;