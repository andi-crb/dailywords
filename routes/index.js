var express = require('express');
var router = express.Router();
var mysql = require ('mysql');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;


var connection = mysql.createConnection({
  host : '127.0.0.1',
  user : 'andi_crb',
  password : '',
  database : 'c9'
})

// Passport and authentication

// serialise

// used to serialize the user for the session
passport.serializeUser(function(User, done) {
  done(null, User.ID);
});

// used to deserialize the user
passport.deserializeUser(function(ID, done) {
  connection.query("select * from Users where ID = "+ID,function(err,rows){	
  	done(err, rows[0]);
  });
});

// Local Signup

passport.use('local-signup', new LocalStrategy({
        usernameField : 'Email',
        passwordField : 'Password',
        passReqToCallback : true 
    },

    function(req, Email, Password, done) {
          console.log("local strategy");
      connection.query("select * from Users where Email = '"+Email+"'",function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err)
        return done(err);
			  if (rows.length) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
      } else {
        var newUserMysql = new Object();
				newUserMysql.Email    = Email;
        newUserMysql.Password = Password; // use the generateHash function in our user model
				var insertQuery = "INSERT INTO Users ( Email, Password ) values ('" + Email +"','"+ Password +"')";
				console.log(insertQuery);
				connection.query(insertQuery,function(err,rows){
				  newUserMysql.id = rows.insertId;
					return done(null, newUserMysql);
				});	
      }	
	});
}));

// Login Strategy

passport.use('local-login', new LocalStrategy({
        usernameField : 'Email',
        passwordField : 'Password',
        passReqToCallback : true 
    },
    function(req, Email, Password, done) { // callback with email and password from our form

         connection.query("SELECT * FROM `Users` WHERE `Email` = '" + Email + "'",function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); 
            } 
			
			// if the user is found but the password is wrong
            if (!( rows[0].Password == Password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
			
            // all is well, return successful user
            return done(null, rows[0]);			
		
		});
		


    }));

//Registration and Logins

router.get('/signup', function(req, res) {
  res.render('signup', { });
});

router.post('/signup', passport.authenticate('local-signup',{
  successRedirect : '/',
  failureRedirect : '/'

}));

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local-login'),
  function(req, res) {
    console.log(req.User)
    res.redirect('/');
  })

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});



/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM Prompts WHERE Date = current_date', function(err, rows){
    res.render('index', { title: 'Daily Words', prompts: rows });
  });
})

router.get('/random', function(req, res, next){
  connection.query('SELECT * FROM Prompts ORDER BY rand() LIMIT 20', function(err, rows){
    var randomPrompt = rows[0];
    res.render('index', { title: 'Daily Words', randPrompts: randomPrompt });
  });
});


router.get('/faqs', function(req, res, next) {
  res.render('faqs', { title: 'Daily Words' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Daily Words' });
});

module.exports = router;
