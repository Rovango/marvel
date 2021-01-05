const program = require('commander');
const { VERSION } = require('../constants');
const { ParamsInquire } = require('../utils');

program
  .version(VERSION)
  .name('[npx] marvel-mock-server')
  .description('Start the mock server')
  .option('-p, --port <mock port>', 'listen port')
  .option('-h, --http-root <http root path>', 'routes root directory of HTTP')
  .option('-w, --ws-root <ws root path>', 'routes root directory of WebSocket')
  .option('-s, --security', 'use https & wss', false)
  .option('-c, --cert <cert path>', 'security cert file')
  .option('-k, --key <key path>', 'security key file')
  .parse(process.argv);

new ParamsInquire(program).inquire(({ port, httpRoot, wsRoot } = {}) => {
  const { key , cert, security } = program;

  const MockServer = require('./server');

  new MockServer({
    httpRoot,
    wsRoot,
    port: port || 8000,
  })
    .initialize({ security, cert, key })
    .start();
});
