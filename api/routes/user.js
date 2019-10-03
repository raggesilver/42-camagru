const router  = require('express').Router();
const User    = require('../models/user');
const guard   = require('../modules/guard');

router.get('/me', guard, async (req, res) => {
  res.json({ username: req.user.username });
});

module.exports = router;
