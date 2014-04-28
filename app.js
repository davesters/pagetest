// Boilerplate and foundational code adapted from https://github.com/hiattp/express3-mongodb-bootstrap-demo

var express = require('express')
  , mongoose = require('mongoose')
  , UserModel = require('./models/user')
  , User = mongoose.model('User')
  , routes = require('./routes')
  , http = require('http')
  , engine = require('ejs-locals')
  , flash = require('connect-flash')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , expressValidator = require('express-validator')
  , mailer = require('express-mailer')
  , config = require('./config')
  , path = require('path')
  , app = express();

app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(expressValidator);
app.use(express.methodOverride());
app.use(express.cookieParser('209nwgosg989hi3hgfurbrg3g23'));
app.use(express.session());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Helpers
app.use(function(req, res, next) {
  res.locals.userIsAuthenticated = req.isAuthenticated(); // check for user authentication
  res.locals.user = req.user; // make user available in all views
  res.locals.errorMessages = req.flash('error'); // make error alert messages available in all views
  res.locals.successMessages = req.flash('success'); // make success messages available in all views
  app.locals.layoutPath = "../shared/layout";
  next();
});

// Mailer Setup
mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.mandrillapp.com', // hostname
  // secureConnection: true, // use SSL
  port: 587, // port for Mandrill
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: config[app.get('env')].MANDRILL_USERNAME,
    pass: config[app.get('env')].MANDRILL_API_KEY
  }
});

// Database Connection
if ('development' == app.get('env')) {
  mongoose.connect('mongodb://localhost/pagetest');
} else {
  mongoose.connect('mongodb://localhost/pagetest');
}

// Authentication
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Sorry, we don't recognize that username." });
      user.validPassword(password, function(err, isMatch){
        if(err) return done(err);
        if(isMatch) return done(null, user);
        else done(null, false, { message: 'Incorrect password.' });
      });
    });
  }
));

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

routes.initRoutes(app, express);

// Start Server w/ DB Connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

  if (app.get('env') !== 'development') {
    http.createServer(app).listen(app.get('port'), function() {
      console.log('Express server listening on port ' + app.get('port'));
    });
  }

});

if (app.get('env') === 'development') {
  module.exports = app;
}