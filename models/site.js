var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var SiteSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  branchName: { type: String, required: true },
  urlBase: { type: String, required: true }
});

module.exports = mongoose.model('Site', SiteSchema);