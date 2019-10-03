const mongoose  = require('mongoose');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
const crypto    = require('crypto');

const schema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
  verified: { type: Boolean, default: false },
  // Settings
  settings: {
    email_notify: { type: Boolean, default: true }
  },
  verification: {
    code: {
      tok: { type: String },
      exp: { type: Date }
    }
  }
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

/**
 * Set this.code to a new token. Tokens are valid for one hour. This function
 * does not save the new token to the user in the database (you need to call
 * .save() manually after)
 * @return {String} the new token.
 */
schema.statics.generateVerificationCode = () => {
  code = {
    tok: crypto.randomBytes(20).toString('hex'),
    exp: new Date() + 60*60*1000
  };

  return (code);
};

module.exports = mongoose.model('user', schema);
