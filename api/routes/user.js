const router  = require('express').Router();
const User    = require('../models/user');
const guard   = require('../modules/guard');

router.get('/me', guard, async (req, res) => {
  return res.status(200).json(req.user.getPersonalData());
});

module.exports = router;
