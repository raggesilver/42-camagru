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

    await Mailer.sendFromTemplate('validate', {
         from: process.env.MAIL_USER,
           to: req.body.email,
      subject: 'Account validation'
    }, { code: user.verification.code.tok });

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
  username:    { validate: notEmpty },
  password: { validate: notEmpty }
};

router.post('/login', reqparams(loginPostParams), async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
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
    e;
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

const rreqPostParams = {
  username: {}, // No validation, just needs to be present
};

router.post('/reset_request', reqparams(rreqPostParams), async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      if (user.verified) {
        await user.sendResetCode(req);
        return res.status(200).json({});
      }
      // If the user hasn't verified the account reject password reset
      else {
        // FIXME: This creates a situation where an user who created an account
        // and didn't verify it and forgot their password can't log in to their
        // account ever again.
        return res.status(400).json({ error: 'Email not verified' });
      }
    }
    else {
      // Usually this would result in a 404 (user/email does not exist) but in
      // order to prevent bruteforce account discovery this will throw a 400
      // masked as an Bad request. I know in this implementation this isn't
      // actually doing anything since this is the only 400 + Bad request in
      // the entire server, but it's probably enough for Camagru.
      return res.status(400).json({ error: 'Bad request' });
    }
  }
  catch(e) {
    e;
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

const rpasPostParams = {
  tok: {}, // No validation, just needs to be present
  password: {
  validate: validatePassword,
       msg: 'Password must have at least 8 characters, one special character '
            + 'and one number.'
  },
};

router.post('/reset_password', reqparams(rpasPostParams), async (req, res) => {
  try {
    let user = await User.findOne({ 'verification.reset.tok': req.body.tok });
    if (user) {
      // Verify that the token is still valid
      if (new Date(user.verification.reset.exp) < new Date())
        return res.status(400).json({ error: 'Token expired' });
      user.verification.reset = null;
      user.password = await User.hashPassword(req.body.password);
      await user.save();
      return res.status(200).json({
        token: user.getToken(),
        user: user.getPersonalData(),
      });
    }
    else {
      return res.status(400).json({ error: 'Invalid token' });
    }
  }
  catch(e) {
    e;
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

module.exports = router;
