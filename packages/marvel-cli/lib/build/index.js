const program = require('commander');
const { BUILD_SCRIPT_PATH, VERSION } = require('../constants');
const { AppInquire, cmd } = require('../utils');

program
  .version(VERSION)
  .name('[npx] marvel build')
  .description('Automatically build Bybit-Marvel application')
  .option('-b, --business <business>', 'application name')
  .option('-p, --platform <mobile|desktop>', 'application platform name')
  .option('-s, --stats', 'output bundle-stats.json')
  .option('-m, --measure-speed', 'output speed measure info')
  .option('-a, --analyze-bundle', 'output bundle analyzer info')
  .parse(process.argv);

new AppInquire(program).inquire(({ business, platform }) =>
  cmd.run(
    [
      cmd.nodeBin('cross-env'),
      'NODE_ENV=production',
      `PROJECT=${business}`,
      `PLATFORM=${platform}`,
      'node',
      `${BUILD_SCRIPT_PATH}`,
      program.stats && '--stats',
      program.measureSpeed && '--measure-speed',
      program.analyzeBundle && '--analyze-bundle',
    ].filter(Boolean),
  ),
);
