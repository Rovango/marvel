const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { APP_CONFIG_FILE_NAME } = require('../constants');
const { validateKeyAndCerts } = require('../utils');

const crtFile = path.resolve(__dirname, '../certs/certificate.pem');
const keyFile = path.resolve(__dirname, '../certs/privatekey.pem');

function readSSLFile(file) {
  if (!fs.existsSync(file)) {
    throw new Error(
      `You enable the ${chalk.cyan('https')} option in your ${chalk.cyan(
        APP_CONFIG_FILE_NAME
      )}, but the file "${chalk.yellow(file)}" can't be found.`
    );
  }
  return fs.readFileSync(file);
}

function getHttpsConfig() {
  const config = {
    crtFile,
    keyFile,
    cert: readSSLFile(crtFile),
    key: readSSLFile(keyFile),
  };
  validateKeyAndCerts(config);
  return config;
}

module.exports = getHttpsConfig;
