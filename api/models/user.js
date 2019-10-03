const mongoose  = require('mongoose');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt');

const schema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
  verified: { type: Boolean, default: false },
  // Settings
  settings: {
    email_notify: { type: Boolean, default: true }
  },
});

schema.statics.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      return resolve(hash);
    });
  });
};

schema.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, match) => {
      if (err) return reject(err);
      return resolve(match);
    });
  });
};

schema.methods.getToken = function () {
  return jwt.sign({
    _id: this._id
  }, process.env.JWT_KEY);
};

module.exports = mongoose.model('user', schema);
