var mongoose = require('mongoose')
  , Site = mongoose.model('Site')

exports.index = function(req, res, next) {
  Site.find(function(err, sites) {
    if (err) {
      return next(err);
    }

    res.render('sites/index', {
      sites: sites
    });
  });
};

exports.newSite = function(req, res) {
  res.render('sites/new', { site: new Site({}) });
};

exports.testValidations = function(req, res, next) {
  var creatingSite = req.url == "/new";
  var updatingSite = !creatingSite; // only to improve readability

  req.assert('name', 'You must provide a name.').notEmpty();
  req.assert('branchName', 'You must provide a branch name.').notEmpty();

  next();
};

exports.create = function(req, res, next) {
  var newSite = new Site(req.body);

  newSite.save(function(err, site) {

    if (err && err.code == 11000) {
      var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
      req.flash('error', "That " + duplicatedAttribute + " is already in use.");
      return res.render('sites/new', { site: newSite, errorMessages: req.flash('error') });
    }

    if (err) {
      return next(err);
    }

    return res.redirect('/sites');
  });
};