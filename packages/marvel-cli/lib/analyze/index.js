const program = require('commander');
const { ANALYZER_ROOT_PATH, DIST_ROOT_PATH, VERSION } = require('../constants');
const { AppInquire, cmd } = require('../utils');

program
  .version(VERSION)
  .name('[npx] marvel analyze')
  .description('Run analyze environment for Bybit-Marvel application')
  .option('-b, --business <business>', 'application name')
  .option('-p, --platform <mobile|desktop>', 'application platform name')
  .parse(process.argv);

new AppInquire(program).inquire(({ business, platform }) =>
  cmd.run(
    [
      `${cmd.nodeBin('webpack-bundle-analyzer')}`,
      `${ANALYZER_ROOT_PATH}/${business}/${platform}/bundle/stats.json`,
      `${DIST_ROOT_PATH}/${business}/${platform}`,
      '-p',
      '8888',
    ].filter(Boolean),
  ),
);
