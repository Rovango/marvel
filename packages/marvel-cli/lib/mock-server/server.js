const http = require('http');
const https = require('https');
const chalk = require('chalk');
const HttpMockServer = require('./http-server');
const WSMockServer = require('./ws-server');
const Utils = require('../utils');
const getHttpsConfig = require('../config/httpsConfig');

class MockServer {
  constructor({ project, platform, port } = {}) {
    this.port = port;
    this.HttpMockServer = new HttpMockServer({ project, platform, port });
    this.WSMockServer = new WSMockServer({ project, platform, port });
    this.HttpMockServer.setWSPool(this.WSMockServer.pool);
    this.server = null;
    this.serverKey = null;
    this.serverCert = null;
    this.security = false;
  }

  initialize(security = false) {
    const app = this.HttpMockServer.initialize().instance();
    if (security) {
      this.security = true;
      const { cert, key } = getHttpsConfig();
      this.serverCert = cert;
      this.serverKey = key;
    }
    this.server = security
      ? https.createServer(
        {
          key: this.serverKey,
          cert: this.serverCert,
        },
        app.callback(),
      )
      : http.createServer(app.callback());
    this.WSMockServer.initialize(this.server);
    return this;
  }

  start() {
    this.server.listen(this.port);
    const ip = Utils.localIPAddress();
    const protocol = this.security ? 'https' : 'http';
    const wsProtocol = this.security ? 'wss' : 'ws';
    // eslint-disable-next-line no-console
    console.log(`mock server is running at:
      - HTTP Local:   ${chalk.cyan(`${protocol}://localhost:${this.port}`)}
      - WS   Local:   ${chalk.cyan(`${wsProtocol}://localhost:${this.port}`)}
      - HTTP Network: ${chalk.cyan(`${protocol}://${ip}:${this.port}`)}
      - WS   Network: ${chalk.cyan(`${wsProtocol}://${ip}:${this.port}`)}
    `);
    return this;
  }
}

module.exports = MockServer;
