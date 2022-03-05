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
            console.log('exist user')
            return done(null, false, { message: 'your email is already used' })
        } else {
            var sql = { email: email, pw: password };
            var query = connection.query('insert into user set ?', sql, function (err, rows) {
                if (err) throw err
                return done(null, { 'email': email });
            })
        }
    })
}));

router.post('/', passport.authenticate('local-join', {
    successRedirect: '/main',
    failureRedirect: '/join',
    failureFlash: true
}))

// router.post('/', function(req,res){
//     var body = req.body;
//     var email = body.email;
//     var name = body.name;
//     var passwd = body.password;

//     var sql = {email : email, name : name, pw: passwd};
//     var query = connection.query('insert into user set ?', sql, function(err,rows){
//         if (err) throw err
//         else res.render('welcome.ejs', {'name': name})
//     })
// })

module.exports = router;