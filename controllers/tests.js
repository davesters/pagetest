var mongoose = require('mongoose')
  , Test = mongoose.model('Test')

exports.index = function(req, res, next) {
  Test.find(function(err, tests) {
    if (err) {
      return next(err);
    }

    res.render('tests/index', {
      tests:tests
    });
  });
};

exports.newTest = function(req, res) {
  res.render('tests/new', { test: new Test({}) });
};

exports.testValidations = function(req, res, next) {
  var creatingTest = req.url == "/new";
  var updatingTest = !creatingTest; // only to improve readability

  req.assert('name', 'You must provide a name.').notEmpty();
  req.assert('url', 'You must provide a URL.').notEmpty();

  next();
};

exports.create = function(req, res, next) {
  var newTest = new Test(req.body);

  newTest.save(function(err, test) {

    if (err && err.code == 11000) {
      var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
      req.flash('error', "That " + duplicatedAttribute + " is already in use.");
      return res.render('tests/new', { test: newTest, errorMessages: req.flash('error') });
    }

    if (err) {
      return next(err);
    }

    return res.redirect('/tests');
  });
};