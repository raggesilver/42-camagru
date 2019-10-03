const jwt   = require('jsonwebtoken');
const User  = require('../models/user');

module.exports = async (req, res, next) => {
  const header = req.headers['authorization'];

  if (typeof header === 'undefined')
    return res.status(401).end();

  const tok = header.split(' ');

  if (tok.length != 2)
    return res.status(401).end();

  jwt.verify(tok[1], process.env.JWT_KEY, async (err, data) => {
    if (err) return res.status(401).end();
    try {
      let user = await User.findById(data._id);
      // Set req.user to the user object
      if (user) {
        req.user = user;
        return next();
      }
    }
    catch(e) { console.log(e); }
    return res.status(401).end();
  });
};
