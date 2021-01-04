// mock文件必须向外暴露 handleIncoming 方法！ 可选的还可以向外暴露 handleClose 方法

const subscribe = (channelID) =>
  ({
    'candle.30.BTCUSDT': (ws) =>
      ws.pushData(
        {
          topic: 'candle.30.BTCUSDT',
          data: [
            {
              start: 1595386800,
              end: 1595388600,
              open: 9359.5,
              close: 9359,
              high: 9359.5,
              low: 9355,
              volume: '43.378',
              turnover: '405974.702',
              confirm: false,
              cross_seq: 273566852,
              timestamp: 1595388189696398,
            },
          ],
          timestamp_e6: 1595388189702177,
        },
        { interval: 1000 },
      ),
    'mark_price.30..MBTCUSDT': (ws) =>
      ws.pushData(
        {
          topic: 'mark_price.30..MBTCUSDT',
          data: [
            {
              start: 1595386800,
              open: '9364.44',
              high: '9366.84',
              low: '9356.02',
              close: '9364.94',
              confirm: false,
            },
          ],
        },
        { interval: 1000 },
      ),
  }[channelID]);

exports.handleIncoming = (ws, request, parsedMessage) => {
  if ('subscribe' === parsedMessage.op) {
    parsedMessage.args.forEach((channel) => subscribe(channel)(ws));
  }
};
