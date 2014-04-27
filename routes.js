var welcome = require('./controllers/welcome')
  , UserModel = require('./models/user')
  , TestModel = require('./models/test')
  , SiteModel = require('./models/site')
  , users = require('./controllers/users')
  , sites = require('./controllers/sites')
  , tests = require('./controllers/tests');

exports.initRoutes = function (app, express) {

  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  } else {
    app.use(function (err, req, res, next) {
      res.render('errors/500', { status: 500 });
    });
  }

  app.get('/', welcome.index);

  // Users
  app.get('/login', redirectAuthenticated, users.login);
  app.get('/reset_password', redirectAuthenticated, users.reset_password);
  app.post('/reset_password', redirectAuthenticated, users.generate_password_reset);
  app.get('/password_reset', redirectAuthenticated, users.password_reset);
  app.post('/password_reset', redirectAuthenticated, users.process_password_reset);
  app.post('/login', redirectAuthenticated, users.authenticate);
  app.get('/register', redirectAuthenticated, users.register);
  app.post('/register', redirectAuthenticated, users.userValidations, users.create);
  app.get('/account', ensureAuthenticated, users.account);
  app.post('/account', ensureAuthenticated, users.userValidations, users.update);
  app.get('/dashboard', ensureAuthenticated, users.dashboard);
  app.get('/logout', users.logout);

  // Tests
  app.get('/tests', ensureAuthenticated, tests.index);
  app.get('/tests/new', ensureAuthenticated, tests.newTest);
  app.post('/tests/new', ensureAuthenticated, tests.testValidations, tests.create);

  // Sites
  app.get('/sites', ensureAuthenticated, sites.index);
  app.get('/sites/new', ensureAuthenticated, sites.newSite);
  app.post('/sites/new', ensureAuthenticated, sites.testValidations, sites.create);

  // 404 Not Found
  app.all('*', welcome.not_found);
}

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }

  req.flash('error', 'Please sign in to continue.');
  var postAuthDestination = req.url;
  res.redirect('/login?postAuthDestination='+postAuthDestination);
}

function redirectAuthenticated(req, res, next){
  if (req.isAuthenticated()) return res.redirect('/');
  next();
}