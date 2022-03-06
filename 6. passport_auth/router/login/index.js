var express = require('express')
var app = express()
var router = express.Router();
var mysql = require('mysql');
var path = require('path')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

// DB SETTING
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'junsuh11!!',
    database: 'jsman'
})

connection.connect()

// ROUTER
router.get('/', function (req, res) {
    var msg;
    var errMsg = req.flash('error')
    if (errMsg) msg = errMsg;
    res.render('login.ejs', { 'message': msg });
})

//passport.serialize
passport.serializeUser(function (user, done) {
    console.log('passport session save : ', user)
    done(null, user)
})

passport.deserializeUser(function (id, done) {
    console.log('passport session get id : ', id)
    done(null, id);
})

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    var query = connection.query('select * from user where email=?', [email], function (err, rows) {
        if (err) return done(err);

        if (rows.length) {
            return done(null, { 'email': email })
        } else {
            return done(null, false, {'message':'your login info is not found ㅠㅠ'});
            }
        })
    }
));

router.post('/', function(req, res, next){
    passport.authenticate('local-login', function(err,user,info){
        if(err) res.status(500).json(err);
        if (!user) return res.status(401).json(info.message);

        req.logIn(user, function(err){
            if (err) {return next(err);}
            return res.json(user);
        });
    })(req, res, next);
})

module.exports = router;