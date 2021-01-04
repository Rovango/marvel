const program = require('commander');
const { VERSION } = require('../constants');
const { AppInquire } = require('../utils');
const updateNativerc = require('../generate/updateNativerc');

program
  .version(VERSION)
  .name('[npx] marvel nativerc')
  .description('Automatically generate .marvelrc-native.js for a application')
  .option('-b, --business <business>', 'application name')
  .option('-p, --platform <mobile|desktop>', 'application platform')
  .option('-f, --field <field>', 'app nativerc key')
  .option('-v, --value <value>', 'app nativerc value')
  .parse(process.argv);

new AppInquire(program).inquire(({ business, platform }) =>
  updateNativerc(business, platform),
);
