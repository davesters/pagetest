var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , hashKey = '19f8ghejndbsjndf08249734yuegoifd';

var UserSchema = new Schema({
  createdAt : { type: Date, default: Date.now },
  username : { type: String, required: true, index: { unique: true } },
  firstName : { type: String, required: true, index: { unique: false } },
  lastName : { type: String, required: true, index: { unique: false } },
  email : { type: String, required: true, index: { unique: true } },
  password : { type: String, required: true },
  resetPasswordToken : { type: String, required: false },
  resetPasswordTokenCreatedAt : { type: Date }
});

UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  var hash = crypto.createHmac('sha256', hashKey).update(this.password).digest('hex');
  user.password = hash;

  next();
});

UserSchema.methods.validPassword = function(candidatePassword, cb) {
  var provided = crypto.createHmac('sha256', hashKey).update(candidatePassword).digest('hex');

  cb(null, this.password == provided);
};

UserSchema.methods.generatePerishableToken = function(cb){
  var user = this;
  var timepiece = Date.now().toString(36);
  var preHash = timepiece + user.email;
  var token = crypto.createHmac('sha256', hashKey).update(preHash).digest('hex');

  cb(null, token);
}

module.exports = mongoose.model('User', UserSchema);