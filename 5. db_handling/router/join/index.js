var express = require('express')
var app = express()
var router = express.Router();
var mysql = require('mysql')
var path = require('path')

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
router.get('/',function(req,res){
    console.log('get join url')
    res.sendFile(path.join(__dirname,'../../public/join.html'))
})

router.post('/', function(req,res){
    var body = req.body;
    var email = body.email;
    var name = body.name;
    var passwd = body.password;
    
    var query = connection.query('insert into user (email,name,pw) values ("' + email + '", "' + name + '", "' + passwd + '")', function(err,rows){
        if (err) {throw err;}
        console.log("db insert")
    })
})

module.exports = router;