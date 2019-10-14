const router  = require('express').Router();
const User    = require('../models/user');
const Post    = require('../models/post');
const guard   = require('../modules/guard');

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

module.exports = router;
