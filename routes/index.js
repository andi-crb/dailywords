var express = require('express');
var router = express.Router();
var moment = require('moment');
var mysql = require ('mysql');

var today = moment().format("YYYY-MM-DD");

var connection = mysql.createConnection({
  host : '127.0.0.1',
  user : 'andi_crb',
  password : '',
  database : 'c9'
})



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(today)
  connection.query('SELECT * FROM Prompts WHERE Date = current_date', function(err, rows){
    res.render('index', { title: 'Daily Words', prompts: rows });
});
})

router.get('/faqs', function(req, res, next) {
  res.render('faqs', { title: 'Daily Words' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Daily Words' });
});

module.exports = router;
