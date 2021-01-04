const os = require('os');
const crypto = require('crypto');
const glob = require('glob');
const fse = require('fs-extra');
const chalk = require('chalk');
const { BYBITIZENS_ROOT_PATH } = require('../constants');

exports.localIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    if (Object.hasOwnProperty.call(interfaces, devName)) {
      const iface = interfaces[devName];
      for (let i = 0; i < iface.length; i += 1) {
        const alias = iface[i];
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }
  }
};

exports.sleep = async (time = 0) =>
  new Promise((resolve) => setTimeout(resolve, time));

exports.validateKeyAndCerts = ({ cert, key, keyFile, crtFile }) => {
  let encrypted;
  try {
    // publicEncrypt will throw an error with an invalid cert
    encrypted = crypto.publicEncrypt(cert, Buffer.from('test'));
  } catch (err) {
    throw new Error(
      `The certificate "${chalk.yellow(crtFile)}" is invalid.\n${err.message}`,
    );
  }

  try {
    // privateDecrypt will throw an error with an invalid key
    crypto.privateDecrypt(key, encrypted);
  } catch (err) {
    throw new Error(
      `The certificate key "${chalk.yellow(keyFile)}" is invalid.\n${
        err.message
      }`,
    );
  }
};

exports.getAllExistApp = () =>
  glob
    .sync(`${BYBITIZENS_ROOT_PATH}/*`)
    .filter((item) => !/src\/bybitizens\/common$/.test(item))
    .map((pname) => pname.split('/').slice(-1)[0]);

exports.dirNotEmptyExists = (dir) =>
  fse.existsSync(dir) &&
  fse.lstatSync(dir).isDirectory() &&
  glob.sync(`${dir}/*`).length > 0;

exports.isFunction = (fn) => typeof fn === 'function';

exports.isTrue = (p) => p === true;

exports.isFalse = (p) => p === false;

exports.isFalsy = (p) => Boolean(p) === false;

exports.isTruthy = (p) => Boolean(p) === true;

exports.printHostingInstructions = require('./printHostingInstructions');

exports.AppInquire = require('./appInquire');

exports.cmd = require('./cmd');

exports.helper = require('./helper');

exports.checkUpdate = require('./checkUpdate');
