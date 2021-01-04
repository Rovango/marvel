const program = require('commander');
const { DEV_SERVER_PATH, MOCK_SERVER_PATH, VERSION } = require('../constants');
const { AppInquire, cmd } = require('../utils');

program
  .version(VERSION)
  .name('[npx] marvel start')
  .description(
    'Automatically run development environment for Bybit-Marvel applications',
  )
  .option('-b, --business <business>', 'application name')
  .option('-p, --platform <mobile|desktop>', 'application platform')
  .option('-d, --mobile-debug', 'enable mobile debug tool')
  .option('-n, --without-mock', 'start without mock server')
  .option('-o, --open', 'open browser when start')
  .parse(process.argv);

new AppInquire(program).inquire(({ business, platform }) => [
  cmd.run(
    [
      `${cmd.nodeBin('cross-env')}`,
      'NODE_ENV=development',
      `PROJECT=${business}`,
      `PLATFORM=${platform}`,
      program.open && 'MARVEL_OPEN_BROWSER=true',
      program.mobileDebug && 'MARVEL_APP_MOBILE_DEBUG=true',
      'node',
      `${DEV_SERVER_PATH}`,
    ].filter(Boolean),
  ),
  program.withoutMock ||
    cmd.run([
      'node',
      `${MOCK_SERVER_PATH}`,
      '--business',
      `${business}`,
      '--platform',
      `${platform}`,
    ]),
]);
