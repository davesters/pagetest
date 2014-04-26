var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var TestSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  url: { type: String, required: true }
});

module.exports = mongoose.model('Test', TestSchema);