var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var TestSchema = new Schema({
  siteId: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true }
});

module.exports = mongoose.model('Test', TestSchema);