const express = require('express');
const router = express.Router();
const passport = require('passport');
const {redirectLogin, redirectDashboard} = require('./accessControls');
const app = express();
const {conInit, con } = require('../config/connection');
const dotenv = require('dotenv');

dotenv.config();

router.get('/google', redirectDashboard, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', redirectDashboard, passport.authenticate('google', { failureRedirect: '/login'}), (req, res) => {
    // Successful authentication, redirect home.
    // console.log(CURRENT_PAGE);
    if (CURRENT_PAGE === 'signup') {
        let sql = `SELECT * FROM users WHERE username = '${req.user.displayName}'`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                let confirmed = 1;
                con.query("INSERT INTO users (userName, email, password) VALUES (?, ?, ?)", [req.user.displayName, req.user.emails[0].value, "NULL"], (err, results) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
    
                const sql = `INSERT INTO images(imagePath, username) VALUES (?, ?)`;
    
                con.query(sql, [req.user.photos[0].value, req.user.displayName], (err, result) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
                return res.redirect('/login');
            }else {
                return res.render("signup", {signupInfo: "Email already exists"});
            }
        });
    } else {
        let sql = `SELECT * FROM users WHERE username = ? AND email = ? LIMIT 1`;
        con.query(sql, [req.user.displayName, req.user.emails[0].value], (err, db) => {
            if (err) throw err;
            if (db.length === 0) {
                return res.render("signup", {signupInfo: "User not found please register"});
            }else {
                req.session.username = req.user.displayName;
                req.session.email = req.user.emails[0].value;
                req.session.photo = req.user.photos[0].value;
                var app_id = process.env.APP_ID;
                var redirect_uri = process.env.REDIRECT_URI;
                var url = "https://connect.deezer.com/oauth/auth.php?app_id="+app_id+"&redirect_uri="+redirect_uri+"&perms=basic_access,email,offline_access,manage_library";
                res.redirect(url);
            }
        })
    }
});

router.get('/42', redirectDashboard, passport.authenticate('42'));

router.get('/42/callback', redirectDashboard, passport.authenticate('42', { failureRedirect: '/signup' }),(req, res) => {
    // Successful authentication, redirect home.
    if (CURRENT_PAGE === 'signup') {
        let sql = `SELECT * FROM users WHERE username = '${req.user.username}'`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                let confirmed = 1;
                con.query("INSERT INTO users (userName, email, password) VALUES (?, ?, ?)", [req.user.username, req.user.emails[0].value, "NULL"], (err, results) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
    
                const sql = `INSERT INTO images(imagePath, username) VALUES (?, ?)`;
    
                con.query(sql, [req.user.photos[0].value, req.user.username], (err, result) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
                return res.redirect('/login');
            }else {
                return res.render("signup", {signupInfo: "Email already exists"});
            }
        });
    } else {
        let sql = `SELECT * FROM users WHERE username = ? AND email = ? LIMIT 1`;
        con.query(sql, [req.user.username, req.user.emails[0].value], (err, db) => {
            if (err) throw err;
            if (db.length === 0) {
                return res.render("signup", {signupInfo: "User not found please register"});
            }else {
                req.session.username = req.user.username;
                req.session.email = req.user.emails[0].value;
                req.session.photo = req.user.photos[0].value;
                var app_id = process.env.APP_ID;
                var redirect_uri = process.env.REDIRECT_URI;
                var url = "https://connect.deezer.com/oauth/auth.php?app_id="+app_id+"&redirect_uri="+redirect_uri+"&perms=basic_access,email,offline_access,manage_library";
                res.redirect(url);
            }
        })
    }
});

router.get('/facebook', redirectDashboard, passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', redirectDashboard, passport.authenticate('facebook', { failureRedirect: '/signup' }), (req, res) => {
    // Successful authentication, redirect home.

    if (CURRENT_PAGE === 'signup') {
        let sql = `SELECT * FROM users WHERE username = '${req.user.displayName}'`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                let confirmed = 1;
                con.query("INSERT INTO users (userName, email, password) VALUES (?, ?, ?)", [req.user.displayName, req.user.emails[0].value, "NULL"], (err, results) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
    
                const sql = `INSERT INTO images(imagePath, username) VALUES (?, ?)`;
    
                con.query(sql, [req.user.photos[0].value, req.user.displayName], (err, result) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
                return res.redirect('/login');
            }else {
                return res.render("signup", {signupInfo: "Email already exists"});
            }
        });
    } else {
        let sql = `SELECT * FROM users WHERE username = ? AND email = ? LIMIT 1`;
        con.query(sql, [req.user.displayName, req.user.emails[0].value], (err, db) => {
            if (err) throw err;
            if (db.length === 0) {
                return res.render("signup", {signupInfo: "User not found please register"});
            }else {
                req.session.username = req.user.displayName;
                req.session.email = req.user.emails[0].value;
                req.session.photo = req.user.photos[0].value;
                var app_id = process.env.APP_ID;
                var redirect_uri = process.env.REDIRECT_URI;
                var url = "https://connect.deezer.com/oauth/auth.php?app_id="+app_id+"&redirect_uri="+redirect_uri+"&perms=basic_access,email,offline_access,manage_library";
                res.redirect(url);
            }
        })
    }
  });

module.exports = router;