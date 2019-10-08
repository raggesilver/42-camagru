const router  = require('express').Router();
const path    = require('path');

const routes = [
  { url: '/user', path: 'user.js' },
  { url: '/auth', path: 'auth.js' },
  { url: '/post', path: 'post.js' },
];

for (const route of routes) {
  if (process.env.DEV)
    console.log(`Route /api${route.url} connected.`);
  router.use(route.url, require(`./routes/${route.path}`));
}

module.exports = router;
