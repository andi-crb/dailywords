var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Daily Words' });
});

router.get('/faqs', function(req, res, next) {
  res.render('faqs', { title: 'Daily Words' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Daily Words' });
});

module.exports = router;
