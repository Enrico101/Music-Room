const express = require('express');
const router = express.Router();
const {redirectLogin, redirectDashboard} = require('./accessControls');

router.get('/', redirectLogin,  (req, res) => {
    req.session.destroy( (err) => {
        if (err) return res.redirect('/home');
        res.clearCookie(process.env.SESS_NAME);
        res.redirect('/login')
    });
});

module.exports = router;