const program = require('commander');
const path = require('path');
const fse = require('fs-extra');
const {
  VERSION,
  CWD_PATH,
  DEFAULT_SERVER_CERT,
  DEFAULT_SERVER_KEY,
} = require('../constants');
const PathInquire = require('./pathInquire');

program
  .version(VERSION)
  .name('[npx] marvel-mock-server emit')
  .description('emit the cert and its key of mock server')
  .option('-c, --cert-path <cert path>', 'cert file path')
  .option('-k, --key-path <key path>', 'key file path')
  .parse(process.argv);

new PathInquire(program).inquire(({ certPath, keyPath } = {}) => {
  const defaultCertFileName = 'marvel_mock_server_certificate.pem';

  certPath =
    certPath &&
    (path.isAbsolute(certPath)
      ? certPath
      : path.resolve(CWD_PATH, certPath));

  if (fse.existsSync(certPath) && fse.lstatSync(certPath).isDirectory()) {
    certPath = path.resolve(certPath, defaultCertFileName);
  }

  const defaultKeyFileName = 'marvel_mock_server_privatekey.pem';
  keyPath =
    keyPath &&
    (path.isAbsolute(keyPath)
      ? keyPath
      : path.resolve(CWD_PATH, keyPath));

  if (fse.existsSync(keyPath) && fse.lstatSync(keyPath).isDirectory()) {
    keyPath = path.resolve(keyPath, defaultKeyFileName);
  }

  certPath &&
    fse.copy(
      DEFAULT_SERVER_CERT,
      certPath,
      { overwrite: false, errorOnExist: true },
      (err) => {
        if (err) return console.error(err);
      }
    );

  keyPath &&
    fse.copy(
      DEFAULT_SERVER_KEY,
      keyPath,
      { overwrite: false, errorOnExist: true },
      (err) => {
        if (err) return console.error(err);
      }
    );
});
