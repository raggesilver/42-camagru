const router        = require('express').Router();
const User          = require('../models/user');
const { reqparams } = require('@raggesilver/reqparams');
const Mailer        = require('../modules/mailer');

const registerPostParams = {
  username: {
    validate: async (val) => {
      val = val.trim();

      if (val.length < 6) return 'Username too short (min 6 characters).';
      if (val.length >= 20) return 'Username too long (max 20 characters).';

      try {
        let user = await User.findOne({ username: val });
        if (!user) return true;
      }
      catch(e) {
        console.error(e);
      }
      return 'Username in use.';
    }
  },
  password: {
    validate: (val) => {
      return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+-]).{8,}$/.test(val);
    },
    msg: 'Password must have at least 8 characters, one special character and one number.'
  },
  email: {
    validate: async (val) => {
      if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      .test(val))
        return 'Invalid email.';

        try {
          let user = await User.findOne({ email: val });
          if (!user) return true;
        }
        catch(e) {
          console.error(e);
        }
        return 'Email in use.';
    }
  }
};

router.post('/register', reqparams(registerPostParams), async (req, res) => {
  try {
    let user = new User({
      email: req.body.email,
      username: req.body.username,
      password: await User.hashPassword(req.body.password),
      verification: {
        code: User.generateVerificationCode()
      }
    });

    await user.save();

    let info = await Mailer.sendFromTemplate('validate', {
         from: 'pvaqueiroz@gmail.com',
           to: req.body.email,
      subject: 'Account validation'
    }, { code: user.verification.code.tok });

    console.log(info);

    return res.status(200).end('OK');
  }
  catch(e) {
    console.error(e);
    return res.status(500).end('Interal Error');
  }
});

module.exports = router;
