// const MockServer = require('@zrf9018/marvel-mock-server');
const MockServer = require('./lib');

new MockServer({
  httpRoot:
    '/Users/rovango/Desktop/projects/bybit/marvel-trade/src/bybitizens/reverse/__mocks__/http/desktop',
  wsRoot:
    '/Users/rovango/Desktop/projects/bybit/marvel-trade/src/bybitizens/reverse/__mocks__/ws/desktop',
  port: 8005,
})
  .initialize({ security: true })
  .start();
