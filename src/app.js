const express = require('express');
const chalk = require('chalk');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const db = require('./services/db.js');
const homeRouter = require('./routes/home.js');
const playerRouter = require('./routes/player.js');
const userRouter = require('./routes/user.js');
const channelRouter = require('./routes/channel.js');
const candidateChannelRouter = require('./routes/candidateChannel.js');
const videoRouter = require('./routes/video.js');
const articleRouter = require('./routes/article.js');
const channelStatisticRouter = require('./routes/channelStatistic.js');

const app = express();

/**
* Loda config by dotenv
*/
dotenv.load({ path: '.env' });

/**
* Set config
*/
app.set('port', process.env.port || 3000);
app.set('db_uri', process.env.MONGODB_URI || process.env.MONGODB_LAB_URI);

/**
* Connect to db
*/
db(app.get('db_uri'));

/**
* Use bodyparser and Express-Validator
*/
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }));

/**
* Allow origin
*/
app.use((req, res, next) => {
  const allowOrigins = process.env.ALLOW_ORIGINS.split(',');
  const origin = req.headers.origin;
  if(allowOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


/**
* Routers
*/
app.use('/', homeRouter);
app.use('/users', userRouter);
app.use('/players', playerRouter);
app.use('/channels', channelRouter);
app.use('/candidateChannels', candidateChannelRouter);
app.use('/videos', videoRouter);
app.use('/articles', articleRouter);
app.use('/channelStatistics', channelStatisticRouter);

/**
* Start server
*/
app.listen(app.get('port'), () => {
  console.log('%s Node server‘s running on port %s', chalk.green('✓'), app.get('port'));
});

module.exports = app;
