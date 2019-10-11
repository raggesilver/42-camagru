const router  = require('express').Router();
const guard   = require('../modules/guard');
const Post    = require('../models/post');
const Comment = require('../models/comment');
const Imgur   = require('../modules/imgur');

const { reqparams, notEmpty } = require('@raggesilver/reqparams');

// Route to get all posts
router.get('/', guard, async (req, res) => {
  let offset = 0;
  let tmp;
  // Maybe get offset from req.body
  if (req.query.offset && !isNaN((tmp = parseInt(req.query.offset))))
    offset = tmp;
  // Query posts ordered by date (new to old) with offset and limit 10
  let posts = await Post.find().sort('-createdAt').skip(offset).limit(10)
    .populate({ path: 'user', select: 'username picture'})
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username picture'
      }
    })
    .exec();

  return res.json(posts);
});

const postParams = {
  text:   { validate: (val) => typeof val === 'string' },
  media:  { validate: (val) => val instanceof Array && val.length > 0 }
};
// Middleware functions for /post and /post/with_image
const postPostMid = [
  guard,
  reqparams(postParams)
];

// Route to create a new post
// TODO: This route should probably be removed as it is not being used
router.post('/', postPostMid, async (req, res) => {
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

router.post('/with_picture', postPostMid, async (req, res) => {
  try {
    // TODO: support multiple media upload
    let r = await Imgur.upload(req.body.media[0]);
    if (r.success) {
      let post = new Post({
            user: req.user._id,
           media: [ r.data.link ],
            text: req.body.text,
           likes: [],
        comments: [],
      });
      await post.save();
      return res.status(200).json(post);
    }
    else {
      console.log(r.data.error);
      return res.status(r.status).json({ error: r.data.error });
    }
  }
  catch (e) {
    // e.status because e is most likely imgur's API response, and it is huge
    console.log(e.status ? `Imgur status ${e.status}` : e);
    return res.status(500).json({ error:'INTERNAL_ERROR' });
  }
});

router.post('/:id/like', guard, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post) {
      let index = post.likes.indexOf(req.user._id);
      // Unlike
      if (index != -1) {
        post.likes.splice(index, 1);
      }
      // Like
      else {
        post.likes.push(req.user._id);
      }
      await post.save();
      return res.status(200).json({ liked: index == -1 });
    }
    // Post does not exist
    else
      return res.status(404).json({ error: 'Post does not exist.' });
  }
  catch (e) { console.log(e); return res.status(500).json({error:'INTERNAL_ERROR'}); }
});

const commentPostParams = {
  text: { validate: notEmpty },
};
// Middleware functions for /post/:id/comment
const commentPostMid = [
  guard,
  reqparams(commentPostParams)
];

router.post('/:id/comment', commentPostMid, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (post) {
      let comment = new Comment({
        text: req.body.text.trim(),
        user: req.user._id,
        likes: []
      });
      // Wait for the comment to be saved
      await comment.save();
      // Then push it to the post's comments
      post.comments.push(comment._id);
      await post.save();
      comment.user = { _id: req.user._id, picture: req.user.picture };
      const com = {
        _id: comment._id,
        text: comment.text,
        user: {
          _id: req.user._id,
          picture: req.user.picture,
          username: req.user.username
        },
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      };
      return res.status(200).json({ comment: com });
    }
    return res.status(404).json({ error: 'Post does not exist.' });
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({error:'INTERNAL_ERROR'});
  }
});

// Middleware functions for /post/upload
const uploadPostMid = [
  guard,
  reqparams({ image: {} })
];

router.post('/upload', uploadPostMid, async (req, res) => {
  console.log(req.body);
  return res.status(200).json({});
});

// router.use((req, res, next, error) => {
//   console.log(error);
//   return res.status(500).json({ error: 'INTERNAL_ERROR' });
// });

module.exports = router;
