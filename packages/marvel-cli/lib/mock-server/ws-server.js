/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const chalk = require('chalk');
const url = require('url');
const WebSocket = require('ws');
const Mock = require('mockjs');
const dayjs = require('dayjs');
const { BYBITIZENS_ROOT_PATH, COLORS } = require('../constants');

class WSServer {
  constructor({ project, platform, port } = {}) {
    this.project = project;
    this.platform = platform;
    this.port = port;
    this.wss = null;
    this.pool = new Map();
    this.defaultTimeout = 0;
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });
    this.wss.on('connection', (ws, request) => {
      const parsedUrl = url.parse(request.url);
      const urlpath = parsedUrl.pathname;
      const wsid = uuid();
      ws._wsid = wsid;
      ws.conn_id = wsid; // 订阅或链接成功回传给客户端
      this.pool.set(wsid, ws); // 可在ws pool中通过id找到ws连接
      this.pool.set(urlpath, ws); // 可在ws pool中通过url找到ws连接
      ws.timer_pool = [];
      ws._urlpath = urlpath;
      this._addShortcutsFn(ws);

      this._WSConnected(ws, request);
    });
    return this;
  }

  _addShortcutsFn(ws) {
    ws.sendData = (data) => {
      const sdata = Mock.mock(data);
      ws.send(JSON.stringify(sdata));
      return ws;
    };

    ws.broadcast = (data) => {
      this._broadcast(data);
      return ws;
    };

    // dataGenerator: 直接字面量 或 数据生成函数
    ws.pushData = (dataGenerator, options) => {
      this._sendInterval(
        () => {
          const data =
            typeof dataGenerator === 'function'
              ? dataGenerator()
              : dataGenerator;
          ws.sendData(data);
        },
        {
          timer_pool: ws.timer_pool,
          ...options,
        },
      );
      return ws;
    };

    ws.sendError = (msg) =>
      ws.sendData({ error: true, success: false, message: msg });

    ws.sendSuccess = (ws, parsedMessage, ret_msg = '') =>
      ws.sendData({
        success: true,
        ret_msg,
        conn_id: ws.conn_id,
        request: parsedMessage,
      });
  }

  _broadcast(data, expts) {
    const excepts = expts instanceof Array ? expts : [expts];
    const alreadySent = [];
    for (const id of this.pool.keys()) {
      const ws = this.pool.get(id);
      if (
        excepts.some((expt) => ws._wsid.startsWith(expt)) ||
        excepts.some((expt) => ws._urlpath.endsWith(expt)) ||
        excepts.includes(ws) ||
        alreadySent.some(
          (asws) => asws._wsid === ws._wsid || asws._urlpath === ws._urlpath,
        )
      ) {
        // eslint-disable-next-line no-continue
        continue;
      }
      ws.sendData(data);
      alreadySent.push(ws);
    }
    return this;
  }

  _sendInterval(
    fn,
    {
      timer_pool,
      interval,
      timeout = this.defaultTimeout,
      immediate = true,
    } = {},
  ) {
    immediate && fn();
    timer_pool.push(
      interval
        ? setInterval(() => fn(), interval)
        : setTimeout(() => fn(), timeout),
    );
    return this;
  }

  _WSConnected(ws, request) {
    const parsedUrl = url.parse(request.url);
    const urlpath = parsedUrl.pathname;
    const mockpath = path.resolve(
      BYBITIZENS_ROOT_PATH,
      `${this.project}/__mocks__/ws/${this.platform}${urlpath}.js`,
    );
    const fileExists =
      fs.existsSync(mockpath) || fs.existsSync(mockpath.replace(/\.js$/, ''));
    const qs = parsedUrl.query ? `?${parsedUrl.query}` : '';
    console.log(
      `[${dayjs().format('HH:mm:ss.SSS')}] ${chalk[
        fileExists ? 'green' : 'red'
      ]('WS Connecting')} ${chalk.cyan(urlpath)}${qs}`,
    );
    if (!fileExists) {
      ws._closeTimer = setTimeout(() => ws.terminate(), 1000);
      ws.on('close', () => clearTimeout(ws._closeTimer));
      return;
    }

    delete require.cache[require.resolve(mockpath)];
    const {
      handleIncoming,
      handleClose,
      autoSuccessResponse = true,
      autoPingResponse = true,
      displayPingLog = true,
      subscribeMap = {},
    } = fileExists ? require(mockpath) : {};
    ws.on('close', () => {
      console.log(
        `[${dayjs().format('HH:mm:ss.SSS')}]`,
        chalk.hex(COLORS.BYBIT_ORANGE)('WS Closed'),
        chalk`{cyan ${urlpath}}`,
      );
      (ws.timer_pool || []).forEach((timer) => [
        clearInterval(timer),
        clearTimeout(timer),
      ]);
      handleClose && handleClose(ws, request);
    });
    ws.on('message', (message) => {
      let parsedMessage = {};
      try {
        parsedMessage = JSON.parse(message);
      } catch (e) {
        ws.sendError(e.toString());
        console.log(chalk.red('[ws incoming message parse error] '), e);
        return;
      }

      const { op } = parsedMessage;
      if (displayPingLog || op !== 'ping') {
        console.log(
          `[${dayjs().format('HH:mm:ss.SSS')}]`,
          chalk.magenta(`WS Incoming ${chalk.cyan(urlpath)}`),
          parsedMessage,
        );
      }

      // 是否需要默认的成功应答 及 ping应答
      if (autoPingResponse && op === 'ping') {
        return ws.sendSuccess(ws, parsedMessage, 'pong');
      }
      if (autoSuccessResponse) {
        ws.sendSuccess(ws, parsedMessage, '');
      }

      if (typeof handleIncoming === 'function') {
        handleIncoming(ws, request, parsedMessage);
      } else {
        this._handleWSIncoming(
          ws,
          request,
          parsedMessage,
          autoSuccessResponse,
          subscribeMap,
        );
      }
    });
  }

  _handleWSIncoming(
    ws,
    request,
    parsedMessage,
    autoSuccessResponse,
    subscribeMap,
  ) {
    const { op } = parsedMessage;
    if (op !== 'subscribe') {
      return !autoSuccessResponse && ws.sendSuccess(ws, parsedMessage, '');
    }

    const parsedUrl = url.parse(request.url);
    const urlpath = parsedUrl.pathname;
    parsedMessage.args.forEach((channel) => {
      let mockpath = path.resolve(
        BYBITIZENS_ROOT_PATH,
        `${this.project}/__mocks__/ws/${this.platform}${urlpath}/${channel}.js`,
      );
      const dummy = path.resolve(
        BYBITIZENS_ROOT_PATH,
        `${this.project}/__mocks__/ws/${this.platform}${urlpath}/${subscribeMap[channel]}.js`,
      );
      const fileExists = fs.existsSync(mockpath);
      const dummyExists = fs.existsSync(dummy);
      if (!fileExists && !dummyExists)
        return console.log(
          `[${dayjs().format('HH:mm:ss.SSS')}]`,
          chalk.red(
            `Unknown Topic [${chalk.hex(COLORS.BYBIT_ORANGE)(
              channel,
            )}] subscribed `,
          ),
          chalk.cyan(request.url),
          JSON.stringify(parsedMessage),
        );

      mockpath = fileExists ? mockpath : dummy;
      delete require.cache[require.resolve(mockpath)];
      const mockFn = require(mockpath);
      if (typeof mockFn === 'function') {
        try {
          mockFn(ws, request, parsedMessage, channel);
        } catch (e) {
          console.log(
            `[${dayjs().format('HH:mm:ss.SSS')}]`,
            chalk.red(
              `WS MockFn throws an Error of topic [${chalk.hex(
                COLORS.BYBIT_ORANGE,
              )(channel)}]`,
            ),
            chalk.cyan(request.url),
            e,
          );
        }
        return;
      }
      const mockdata = mockFn;
      try {
        ws.sendData(mockdata);
      } catch (e) {
        console.log(
          `[${dayjs().format('HH:mm:ss.SSS')}]`,
          chalk.red(
            `WS Mockdata Illegal of topic [${chalk.hex(COLORS.BYBIT_ORANGE)(
              channel,
            )}]`,
          ),
          chalk.cyan(request.url),
          mockdata,
          e,
        );
      }
    });
  }
}

module.exports = WSServer;
