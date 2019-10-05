const router  = require('express').Router();
const User    = require('../models/user');
const guard   = require('../modules/guard');

router.get('/me', guard, async (req, res) => {
  delete req.user.password;
  delete req.user.verification;
  return res.status(200).json(req.user);
});

module.exports = router;
