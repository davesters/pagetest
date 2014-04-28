var mongoose = require('mongoose')
  , Site = mongoose.model('Site')
  , Test = mongoose.model('Test');

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

exports.view = function(req, res) {
  Site.findById(req.param('site_id'), function (err, site) {
    Test.find({ siteId: site._id }, function(err, tests) {

      res.render('sites/view', { site: site, tests: tests });
    });
  });
};

exports.newSite = function(req, res) {
  res.render('sites/new', { site: new Site({}) });
};

exports.siteValidations = function(req, res, next) {
  var creatingSite = req.url == "/new";
  var updatingSite = !creatingSite; // only to improve readability

  req.assert('name', 'You must provide a name.').notEmpty();
  req.assert('branchName', 'You must provide a branch name.').notEmpty();
  req.assert('urlBase', 'You must provide a base URL.').notEmpty();

  next();
};

exports.create = function(req, res, next) {
  var newSite = new Site(req.body);

  newSite.userId = req.user._id.toString();

  newSite.save(function(err, site) {

    if (err && err.code == 11000) {
      var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
      req.flash('error', "That " + duplicatedAttribute + " is already in use.");
      return res.render('sites/new', { site: newSite, errorMessages: req.flash('error') });
    }

    if (err) {
      return next(err);
    }

    return res.redirect('/sites/view/' + site._id);
  });
};

exports.edit = function(req, res) {
  Site.findById(req.param('site_id'), function (err, site) {
    res.render('sites/edit', { site: site });
  });
};

exports.update = function(req, res, next) {
  Site.findById(req.body._id, function (err, siteToUpdate) {
    siteToUpdate.name = req.body.name;
    siteToUpdate.branchName = req.body.branchName;
    siteToUpdate.urlBase = req.body.urlBase;

    siteToUpdate.save(function(err, site) {
      if (err && err.code == 11000) {
        var duplicatedAttribute = err.err.split("$")[1].split("_")[0];
        req.flash('error', "That " + duplicatedAttribute + " is already in use.");
        return res.render('sites/edit', { site: siteToUpdate, errorMessages: req.flash('error') });
      }

      if (err) {
        return next(err);
      }

      return res.redirect('/sites/view/' + site._id);
    });
  });
};