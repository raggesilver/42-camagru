const router  = require('express').Router();
const guard   = require('../modules/guard');
const Post    = require('../models/post');
const Comment = require('../models/comment');

const { reqparams, notEmpty } = require('@raggesilver/reqparams');

// Route to get all posts
router.get('/', guard, async (req, res) => {
  let offset = 0;
  let tmp;

  if (req.query.offset && !isNaN((tmp = parseInt(req.query.offset))))
    offset = tmp;

  let posts = await Post.find().sort('-createdAt').skip(offset).limit(10)
    .populate({ path: 'user', select: 'username picture'})
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username picture'
      }
    })
    // .populate('comments')
    // .populate({ path: 'comments.user', select: 'username picture'})
    .exec();

  return res.json(posts);
});

const postParams = {
  text:   { validate: (val) => typeof val === 'string' },
  media:  { validate: (val) => val instanceof Array && val.length > 0 }
};

// Route to create a new post
router.post('/', [ guard, reqparams(postParams) ], async (req, res) => {
  let post = new Post({
        user: req.user._id,
       media: req.body.media,
        text: req.body.text,
       likes: [],
    comments: [],
  });

  await post.save();

  return res.json(post);
});

router.post('/:id/like', guard, async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (post) {
      // Unlike
      let index = post.likes.indexOf(req.user._id);
      if (index != -1) {
        post.likes.splice(index, 1);
        await post.save();
      }
      // Like
      else {
        post.likes.push(req.user._id);
        await post.save();
      }
      return res.status(200).json({ liked: index == -1 });
    }
    else
      return res.status(200).json({});
  }
  catch (e) { return next(e); }
});

const commentPostParams = {
  text: { validate: notEmpty },
};

router.post('/:id/comment', [ guard, reqparams(commentPostParams) ],
async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (post) {
      let comment = new Comment({
        text: req.body.text.trim(),
        user: req.user._id,
        likes: []
      });

      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      return res.status(200).json({ comment });
    }
    return res.status(200).json({});
  }
  catch (e) { return next(e); }
});

router.use((req, res, next, error) => {
  console.log(error);
  return res.status(500).json({ error: 'INTERNAL_ERROR' });
});

module.exports = router;
