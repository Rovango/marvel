const os = require('os');
const chalk = require('chalk');
const crypto = require('crypto');

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

exports.sleep = async (time = 0) =>
  new Promise((resolve) => setTimeout(resolve, time));

exports.isFunction = (fn) => typeof fn === 'function';

exports.helper = require('./helper');

exports.ParamsInquire = require('./paramsInquire');
