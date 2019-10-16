const express     = require('express');
const mongoose    = require('mongoose');
const bodyParser  = require('body-parser');
const history     = require('connect-history-api-fallback');
const path        = require('path');
const cors        = require('cors');
const app         = express();

function log(...args) {
  if (process.env.DEV)
    console.log(...args);
}

/**
 * Initialize the app
 */
app.use(cors({ credentials: true, origin: true }));
const historyMiddleware = history();
// Do redirect /api calls to front-end
app.use((req, res, next) => {
  if (req.path.startsWith('/api'))
    next();
  else
    historyMiddleware(req, res, next);
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', require('./api/app'));
app.use(express.static(path.join(__dirname, 'front', 'dist')));

app.use((req, res, next) => {
  res.status(404).end('Not found');
});

function startApp() {
  app.listen(process.env.PORT || 3000, function () {
    log(`Server running on port ::${this.address().port}`);
  });
}

const mongoOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

/**
 * Start the app after mongoose connected
 */
mongoose.connect(process.env.DB_URL, mongoOpts)
  .then(() => startApp())
  .catch(err => log(err));
