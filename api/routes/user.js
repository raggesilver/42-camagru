const router  = require('express').Router();
const User    = require('../models/user');
const Post    = require('../models/post');
const Comment = require('../models/comment');
const guard   = require('../modules/guard');
const _       = require('@raggesilver/hidash');

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
    e;
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
        e;
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
  },
  email: {
    validate: async (val) => {
      if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          .test(val))
        return 'Invalid email';

      try {
        let user = await User.findOne({ email: val });
        if (!user) return true;
      }
      catch(e) {
        console.error(e);
      }
      return 'Email in use';
    },
    optional: true,
  },
};

const updatePostMid = [ guard, reqparams(updatePostParams) ];

router.post('/update', updatePostMid, async (req, res) => {
  const fields = [ 'username', 'settings.email_notify', 'picture', 'email' ];
  try {
    let user = req.user;
    // Update valid keys
    for (const key in req.body) {
      if (fields.indexOf(key) == -1) continue ;
      _.setByString(user, key, req.body[key]);
    }

    // Change password
    if ('newPassword' in req.body && 'oldPassword' in req.body) {
      if (!(await user.comparePassword(req.body.oldPassword)))
        return res.status(400).json({ error: 'Invalid password' });
      user.password = await User.hashPassword(req.body.newPassword);
    }

    // Send the confirmation mail, calls user.save()
    if ('email' in req.body) {
      user.verified = false;
      await user.sendVerificationCode(req);
    }
    // Save manually
    else {
      await user.save();
    }

    return res.status(200).json(user.getPersonalData());
  }
  catch(e) {
    e;
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

router.post('/delete_self', guard, async (req, res) => {
  try {
    await Comment.deleteMany({ user: req.user._id });
    await Post.deleteMany({ user: req.user._id });
    await User.deleteOne({ _id: req.user._id });

    delete req.user;

    return res.status(200).json({});
  }
  catch(e) {
    e;
    return res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
});

module.exports = router;
