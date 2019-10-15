const mongoose  = require('mongoose');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
const crypto    = require('crypto');
const Mailer    = require('../modules/mailer');

const schema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  email:    { type: String },
  picture:  { type: String, default: 'https://imgur.com/IqlHUiV.png' },
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

schema.statics.generateVerificationCode = () => {
  code = {
    tok: crypto.randomBytes(20).toString('hex'),
    exp: new Date()
  };

  code.exp.setHours(code.exp.getHours() + 1);

  return (code);
};

/**
 * Generate a new code and send it to the user's email.
 * Throws Mailer/Mongoose errors.
 */
schema.methods.sendVerificationCode = async function (req) {
  this.verification.code = this.constructor.generateVerificationCode();
  await this.save();

  return await Mailer.sendFromTemplate('validate', {
        from: process.env.MAIL_USER,
          to: req.body.email,
     subject: 'Account validation'
    }, { code: this.verification.code.tok });
};

schema.methods.getPersonalData = function () {
  let data = {
         _id: this._id,
       email: this.email,
    username: this.username,
    settings: this.settings,
    verified: this.verified,
     picture: this.picture,
  };

  return (data);
};

schema.methods.getPublicData = function () {
  let data = {
         _id: this._id,
    username: this.username,
     picture: this.picture,
  };

  return (data);
};

module.exports = mongoose.model('user', schema);
