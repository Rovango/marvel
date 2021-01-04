const path = require('path');
const findCacheDir = require('find-cache-dir');
const name = require('../NAME');

const cacheDir = findCacheDir({ name, create: true });

exports.VERSION_CHECK_FILE = cacheDir
  ? path.resolve(cacheDir, 'version.json')
  : '';
