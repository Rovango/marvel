const program = require('commander');
const { TEST_SCRIPT_PATH, VERSION } = require('../constants');
const { AppInquire, cmd } = require('../utils');

program
  .version(VERSION)
  .name('[npx] marvel test')
  .description('Automatically run unit test of Bybit-Marvel application')
  .option('-b, --business <business>', 'application name')
  .option('-p, --platform <mobile|desktop>', 'application platform')
  .option('-c, --coverage', 'generate coverage report')
  .option('-n, --watchNone', 'run jest no watch')
  .option('-a, --watchAll', 'run jest watch all')
  .parse(process.argv);

new AppInquire(program).inquire(({ business, platform }) =>
  cmd.run(
    [
      cmd.nodeBin('cross-env'),
      `PROJECT=${business}`,
      `PLATFORM=${platform}`,
      'node',
      `${TEST_SCRIPT_PATH}`,
      program.coverage && '--coverage',
      program.watchNone && '--no-watch',
      program.watchAll && '--watchAll',
    ].filter(Boolean),
  ),
);
