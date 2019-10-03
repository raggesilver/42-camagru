const router  = require('express').Router();
const path    = require('path');

const routes = [
  { url: '/user', path: 'user.js' },
];

for (const route of routes) {
  router.use(route.url, require(`./routes/${route.path}`));
  // console.log(`Route /api${route.url} connected.`);
}

module.exports = router;
