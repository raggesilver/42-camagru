const router  = require('express').Router();
const User    = require('../models/user');
const Post    = require('../models/post');
const guard   = require('../modules/guard');

const { reqparams } = require('@raggesilver/reqparams');

router.get('/me', guard, async (req, res) => {
  return res.status(200).json(req.user.getPersonalData());
});

router.get('/profile/:username', guard, async (req, res) => {
  if (req.params.username == 'me')
    req.params.username = req.user.username;
  try {
    let user = await User.findOne({ username: req.params.username })
      .select('username picture');
    if (user) {
      // Query to get user feed
      let query = Post.find({ user: user._id }).sort('-createdAt')
        .populate({ path: 'user', select: 'username picture'})
        .populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'username picture'
          }
        });
      return res.status(200).json({
        user,
        posts: await query.exec()
      });
    }
    else
      return res.status(404).json({ error: 'User does not exist' });
  }
  catch(e) {
    console.log(e);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

const updatePostParams = {
  username: {
    validate: async (val) => {
      if (typeof val !== 'string')
        return false;

      if (val.length < 6) return 'Username too short (min 6 characters).';
      if (val.length >= 20) return 'Username too long (max 20 characters).';

      try {
        let user = await User.findOne({ username: val });
        if (!user) return true;
      }
      catch(e) {
        console.log(e);
      }

      return 'Username in use';
    },
    optional: true
  },
  'settings.email_notify': {
    validate: (val) => typeof val === 'boolean',
    optional: true
  },
  picture: {
    validate: (val) => typeof val === 'string',
    optional: true
  }
};

/**
 * This function is VERY UNSAFE and should not be used anywhere else. It works
 * in this case because the keys are previously validated and guaranteed to be
 * valid
 */
/**
 * @param {Object} o self
 * @param {String} s path
 */
Object.getByString = function (o, s) {
  let parts = s.trim().split('.');
  let cur = o;
  for (const part of parts) {
    if (cur.hasOwnProperty(part))
      cur = cur[part];
    else {
      cur = null;
      break ;
    }
  }
  return (cur);
};

/**
 * @param {Object} o self
 * @param {String} s path
 * @param {Any} val value
 */
Object.setByString = function (o, s, val) {
  let parts = s.trim().split('.');
  let cur = o;
  let i = 0;
  for (const part of parts) {
    if (typeof cur === 'object' && cur.hasOwnProperty(part)) {
      if (i + 1 == parts.length) {
        cur[part] = val;
        return (cur[part]);
      } else {
        cur = cur[part];
      }
    }
    else
      return undefined;
    i++;
  }
  return (cur);
};

router.post('/update', [guard, reqparams(updatePostParams)], async (req, res) => {
  const fields = [ 'username', 'settings.email_notify', 'picture' ];
  try {
    let user = req.user;
    // Update valid keys
    for (const key in req.body) {
      if (fields.indexOf(key) == -1) continue ;
      Object.setByString(user._doc, key, req.body[key]);
    }

    // Change password
    if ('password' in req.body && 'oldPassword' in req.body) {
      if (!(await user.comparePassword(req.body.oldPassword)))
        return res.status(400).json({ error: 'Invalid password' });
      user.password = await User.hashPassword(req.body.password);
    }

    await user.save();
    return res.status(200).json(user);
  }
  catch(e) {
    console.log(e);
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

module.exports = router;
