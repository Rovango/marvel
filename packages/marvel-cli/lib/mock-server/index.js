const program = require('commander');
const path = require('path');
const { VERSION, BYBITIZENS_ROOT_PATH } = require('../constants');
const { AppInquire } = require('../utils');

program
  .version(VERSION)
  .name('[npx] marvel mock')
  .description('Start the mock server of marvel-cli')
  .option('-b, --business <business>', 'application name')
  .option('-p, --platform <mobile|desktop>', 'application platform')
  .parse(process.argv);

new AppInquire(program).inquire(({ business, platform }) => {
  process.env.PROJECT = process.env.PROJECT || business;
  process.env.PLATFORM = process.env.PLATFORM || platform;

  // const MockServer = require('./server');
  // const appConfig = require('../config/app');

  // new MockServer({
  //   project: business,
  //   platform,
  //   port: appConfig.mockPort || 8000,
  // })
  //   .initialize(appConfig.https)
  //   .start();

  const appConfig = require('../config/app');
  const httpRoot = path.resolve(
    `${BYBITIZENS_ROOT_PATH}/${business}/__mocks__/http/${platform}`,
  );
  const wsRoot = path.resolve(
    `${BYBITIZENS_ROOT_PATH}/${business}/__mocks__/ws/${platform}`,
  );
  const port = appConfig.mockPort || 8000;
  const security = appConfig.https;

  const MockServer = require('@zrf9018/marvel-mock-server');
  new MockServer({
    httpRoot,
    wsRoot,
    port,
  })
    .initialize({ security })
    .start();
});
