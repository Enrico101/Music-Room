var express = require('express');

router = express.Router();

router.get('/', (req, res) => {
    res.render('login');
})

module.exports = router;