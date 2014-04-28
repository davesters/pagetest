var mongoose = require('mongoose')
  , Test = mongoose.model('Test')
  , Site = mongoose.model('Site');

exports.view = function(req, res) {
  Test.findById(req.param('test_id'), function (err, test) {
    Site.findById(test.siteId, function (err, site) {
      res.render('tests/view', { test: test, site: site });
    });
  });
};

exports.newTest = function(req, res) {
  Site.findById(req.param('site_id'), function (err, site) {
    res.render('tests/new', { test: new Test({}), site: site });
  });
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

    return res.redirect('/sites/view/' + test.siteId);
  });
};

exports.edit = function(req, res) {
  Test.findById(req.param('test_id'), function (err, test) {
    Site.findById(test.siteId, function (err, site) {
      res.render('tests/edit', { test: test, site: site });
    });
  });
};

exports.update = function(req, res, next) {
  Test.findById(req.body._id, function (err, testToUpdate) {
    testToUpdate.name = req.body.name;
    testToUpdate.url = req.body.url;

    testToUpdate.save(function(err, test) {
      if (err && err.code == 11000) {
        var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
        req.flash('error', "That " + duplicatedAttribute + " is already in use.");
        return res.render('tests/edit', { site: testToUpdate, errorMessages: req.flash('error') });
      }

      if (err) {
        return next(err);
      }

      return res.redirect('/sites/view/' + test.siteId);
    });
  });
};