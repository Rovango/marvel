/* eslint-disable import/no-dynamic-require */
const path = require('path');

// 版本号
const VERSION = require(path.resolve(__dirname, '../../package.json')).version;

module.exports = VERSION;
