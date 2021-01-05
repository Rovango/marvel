const fs = require('fs');
const path = require('path');

exports.VERSION = require('./VERSION');

exports.COLORS = require('./colors');

exports.CWD_PATH = fs.realpathSync(process.cwd());

exports.MARVEL_MOCK_SERVER_ROOT_PATH = path.resolve(__dirname, '../../');

exports.MARVEL_MOCK_SERVER_LIB_PATH = path.resolve(
  exports.MARVEL_MOCK_SERVER_ROOT_PATH,
  'lib'
);

exports.MARVEL_MOCK_SERVER_UI_ROOT = path.resolve(
  exports.MARVEL_MOCK_SERVER_LIB_PATH,
  'ui'
);

exports.DEFAULT_SERVER_CERT = path.resolve(
  exports.MARVEL_MOCK_SERVER_LIB_PATH,
  'mock-server/certs/certificate.pem'
);

exports.DEFAULT_SERVER_KEY = path.resolve(
  exports.MARVEL_MOCK_SERVER_LIB_PATH,
  'mock-server/certs/privatekey.pem'
);
