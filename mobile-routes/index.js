var express = require('express');
const {redirectLogin, redirectDashboard} = require('./accessControls');

router = express.Router();

router.get('/', redirectDashboard, (req, res) => {
    res.render('index');
})

module.exports = router;