/* eslint-disable import/no-dynamic-require */
const path = require('path');

/*
  @bybit/marvel-cli 名称
*/
const NAME = require(path.resolve(__dirname, '../../package.json')).name;

module.exports = NAME;
