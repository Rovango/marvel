const path = require('path');
const chalk = require('chalk');
const { COLORS } = require('../constants');
const slogans = require('./slogans');

exports.triggerObtainer = (httpRoot) => {
  return (triggerName, searchPath = '') => {
    try {
      const searchFrom = path.isAbsolute(searchPath)
        ? searchPath
        : path.join(httpRoot, `__triggers`);
      const triggerPath = require.resolve(
        path.isAbsolute(triggerName)
          ? triggerName
          : path.join(searchFrom, triggerName)
      );
      delete require.cache[triggerPath];
      // eslint-disable-next-line import/no-dynamic-require
      return require(triggerPath);
    } catch (e) {
      const msg = `${chalk.white.bgRed(' ERROR ')} trigger [${chalk.hex(
        COLORS.BYBIT_ORANGE
      )(triggerName)}] does not exist`;
      console.log(msg);
      console.log(e.message);
    }
  };
};

exports.getSlogan = () => {
  return slogans[Math.floor(Math.random() * slogans.length)];
};
