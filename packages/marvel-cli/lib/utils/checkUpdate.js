const fse = require('fs-extra');
const { TIME, CACHE, MARVEL_BIN_NAME } = require('../constants');
const { runSync } = require('./cmd');

module.exports = () => {
  const cacheFile = CACHE.VERSION_CHECK_FILE;
  // eslint-disable-next-line import/no-dynamic-require
  const { checkTime = 0 } = fse.existsSync(cacheFile) ? require(cacheFile) : {};
  if (Date.now() - checkTime > TIME.MS.ONE_DAY) {
    runSync(['npx', MARVEL_BIN_NAME, 'update', '-s']);
  }
};
