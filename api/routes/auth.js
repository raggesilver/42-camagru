const router        = require('express').Router();
const User          = require('../models/user');
const { reqparams,
        notEmpty  } = require('@raggesilver/reqparams');
const Mailer        = require('../modules/mailer');
const guard         = require('../modules/guard');

async function validateUsername(val) {
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

function validatePassword(val) {
  return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+-]).{8,}$/.test(val);
}

async function validateEmail(val) {
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

const registerPostParams = {
  username: { validate: validateUsername },
  email:    { validate: validateEmail },
  password: {
    validate: validatePassword,
         msg: 'Password must have at least 8 characters, one special character '
              + 'and one number.'
  },
};

router.post('/register', reqparams(registerPostParams), async (req, res) => {
  try {
    let user = new User({
             email: req.body.email,
          username: req.body.username,
          password: await User.hashPassword(req.body.password),
      verification: { code: User.generateVerificationCode() }
    });

    await user.save();

    let info = await Mailer.sendFromTemplate('validate', {
         from: process.env.MAIL_USER,
           to: req.body.email,
      subject: 'Account validation'
    }, { code: user.verification.code.tok });

    console.log(info);

    return res.status(200).json({
      token: user.getToken(),
       user: user.getPersonalData()
    });
  }
  catch(e) {
    console.error(e);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

const loginPostParams = {
  email:    { validate: notEmpty },
  password: { validate: notEmpty }
};

router.post('/login', reqparams(loginPostParams), async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    let payload = {
      token: user.getToken(),
       user: user.getPersonalData()
    };

    return res.status(200).json(payload);
  }
  catch(e) {
    console.error(e);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.post('/validate/:tok', guard, async (req, res) => {
  // console.log('Here with token: ' + req.params.tok);
  try {
    let user = await User.findOne({ "verification.code.tok": req.params.tok });
    if (user) {
      if (new Date(user.verification.code.exp) < new Date())
        return res.status(400).json({ error: 'TOKEN_EXPIRED' });

      user.verification.code = null;
      user.verified = true;

      await user.save();

      return res.status(200).json({ user: req.user.getPersonalData() });
    }
    else {
      return res.status(400).json({ error: 'Invalid token' });
    }
  }
  catch(e) {
    console.error(e);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.post('/revalidate', guard, async (req, res) => {
  try {
    let response = 'ALREADY_VERIFIED';

    if (!req.user.verified) {
      req.user.verification.code = User.generateVerificationCode();
      await req.user.save();
      await Mailer.sendFromTemplate('validate', {
           from: process.env.MAIL_USER,
             to: req.user.email,
        subject: 'Account validation'
      }, { code: req.user.verification.code.tok });
      response = 'Verification email re-sent.';
    }

    return res.status(200).json({ msg: response });
  }
  catch(e) {
    console.log(e);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

module.exports = router;
