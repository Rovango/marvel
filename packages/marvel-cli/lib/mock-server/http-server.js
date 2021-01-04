/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const serve = require('koa-static');
const mount = require('koa-mount');
const { MARVEL_CLI_UI_ROOT } = require('../constants');
const historyApiFallback = require('./middlewares/historyApiFallback');
const mockCore = require('./middlewares/mockCore');
const apiRoutes = require('./routes/api');

class HttpMockServer {
  constructor({ project, platform, port } = {}) {
    this.project = project;
    this.platform = platform;
    this.port = port;
    this.app = new Koa();
    this.WSPool = null;
  }

  initialize() {
    this.app.use(bodyParser());
    router.get('/', (ctx) => {
      ctx.response.body =
        "<h3>I'm marvel general, also the HTTP mock server!</h3>";
    });
    router.get('/favicon.ico', (ctx) => {
      ctx.response.body = fs.readFileSync(
        path.join(__dirname, './favicon.ico'),
      );
    });

    // mockServer 服务Api
    router.use('/_marvel_api_', apiRoutes(this.port));
    this.app.use(router.routes());

    // 核心Mock中间件
    this.app.use(
      mockCore({
        project: this.project,
        platform: this.platform,
        WSPool: this.WSPool,
        ignore: [/^\/_marvel_ui_/, /^\/_marvel_api_/],
      }),
    );

    // _marvel_ui_ 单页化部署
    this.app.use(
      historyApiFallback({
        rewrites: [{ from: /^\/_marvel_ui_[^.]*$/, to: '/_marvel_ui_' }],
      }),
    );
    this.app.use(mount('/_marvel_ui_', serve(MARVEL_CLI_UI_ROOT)));

    return this;
  }

  setWSPool(pool) {
    this.WSPool = pool;
  }

  instance() {
    return this.app;
  }
}

module.exports = HttpMockServer;
