const mongoose = require('mongoose');
const chalk = require('chalk');

/**
* connect to DB
*/
const connect = (dbUri) => {
  mongoose.Promise = global.Promise;
  mongoose.connect(dbUri);
  mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s Connecting to Mongodb failed, please check your mongodb', chalk.red('✗'));
    process.exit();
  });
  mongoose.connection.on('connected', () => {
    console.log('%s Successful connected to Mongodb', chalk.green('✓'));
  });
};

module.exports = connect;
