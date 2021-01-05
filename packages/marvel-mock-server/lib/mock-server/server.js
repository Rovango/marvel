const http = require('http');
const https = require('https');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const HttpMockServer = require('./http-server');
const WSMockServer = require('./ws-server');
const Utils = require('../utils');

const CHECK_SECURITY_CONFIG = Symbol('MockServer check security config');
const READ_SSL_FILE = Symbol('MockServer read ssl file');
class MockServer {
  constructor({ port, httpRoot, wsRoot } = {}) {
    this.port = port;
    this.HttpMockServer = new HttpMockServer({ httpRoot, port });
    this.WSMockServer = new WSMockServer({ wsRoot, port });
    this.HttpMockServer.setWSPool(this.WSMockServer.pool);
    this.server = null;
    this.serverKey = null;
    this.serverCert = null;
    this.security = false;
    this.defaultCertFile = path.resolve(__dirname, 'certs/certificate.pem');
    this.defaultKeyFile = path.resolve(__dirname, 'certs/privatekey.pem');
  }

  initialize({ security = false, cert: crtFile, key: keyFile } = {}) {
    const app = this.HttpMockServer.initialize().instance();
    if (security) {
      this.security = true;
      const { cert: serverCert, key: serverKey } = this[CHECK_SECURITY_CONFIG](
        crtFile || this.defaultCertFile,
        keyFile || this.defaultKeyFile
      );
      this.serverCert = serverCert;
      this.serverKey = serverKey;
    }
    this.server = security
      ? https.createServer(
          {
            key: this.serverKey,
            cert: this.serverCert,
          },
          app.callback()
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

    const httpLocalUrl = `${protocol}://localhost:${this.port}`;
    const httpNetWorkUrl = `${wsProtocol}://localhost:${this.port}`;
    const wsLocalUrl = `${protocol}://${ip}:${this.port}`;
    const wsNetworkUrl = `${wsProtocol}://${ip}:${this.port}`;
    // eslint-disable-next-line no-console
    console.log(`mock server is running at:
      - HTTP Local:   ${chalk.cyan(httpLocalUrl)}
      - WS   Local:   ${chalk.cyan(httpNetWorkUrl)}
      - HTTP Network: ${chalk.cyan(wsLocalUrl)}
      - WS   Network: ${chalk.cyan(wsNetworkUrl)}
    `);
    return this;
  }

  [READ_SSL_FILE](file) {
    if (!fs.existsSync(file)) {
      throw new Error(
        `You enable the ${chalk.cyan(
          'security'
        )} option, but the file "${chalk.yellow(file)}" can't be found.`
      );
    }
    return fs.readFileSync(file);
  }

  [CHECK_SECURITY_CONFIG](crtFile, keyFile) {
    const config = {
      crtFile,
      keyFile,
      cert: this[READ_SSL_FILE](crtFile),
      key: this[READ_SSL_FILE](keyFile),
    };
    Utils.validateKeyAndCerts(config);
    return config;
  }
}

module.exports = MockServer;
