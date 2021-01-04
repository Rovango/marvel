import React from 'react';

export default class MarvelWsPage extends React.Component {
  constructor() {
    super();
    const channels = ['candle.30.BTCUSDT', 'mark_price.30..MBTCUSDT'];
    const messages = {};
    channels.forEach((channel) => {
      messages[channel] = [];
    });
    const security = window.location.protocol !== 'http:';
    this.state = {
      ws: null,
      channels,
      messages,
      uri: `${security ? 'wss' : 'ws'}://${
        window.location.host
      }/wsapi/v1/realtime_public`,
    };
  }

  componentWillUnmount() {
    const { ws } = this.state;
    ws?.close();
  }

  testMarvelWS() {
    const { uri } = this.state;
    const ws = new WebSocket(uri);
    // console.log(ws);
    ws.sendData = (data) => ws.send(JSON.stringify(data));
    ws.onopen = () => {
      // console.log('Connection open ...');
      const { channels } = this.state;
      channels.forEach((channel) =>
        ws.sendData({ op: 'subscribe', args: [channel] }),
      );
    };
    ws.onmessage = (evt) => {
      // console.log(`Received Message: ${evt.data}`);
      const { topic, data } = JSON.parse(evt.data);
      const { messages } = this.state;
      messages?.[topic]?.push(JSON.stringify(data));
      this.setState({ messages });
    };
    ws.onclose = () => {
      // console.log('Connection closed.');
    };
    this.setState({ ws });
  }

  closeWS() {
    const { ws } = this.state;
    ws.close();
  }

  render() {
    const { channels, messages } = this.state;
    return (
      <div className="examples-marvel-ws-page">
        <h1>Marvel WebSocket API Usage</h1>
        <p>
          This demo shows how to use WebSocket to subscribe message from
          Marvel&apos;s WS API.
        </p>
        <button
          type="button"
          className="btn-ws-marvel"
          onClick={this.testMarvelWS.bind(this)}
        >
          subscribe
        </button>
        <button
          type="button"
          className="btn-ws-marvel"
          onClick={this.closeWS.bind(this)}
        >
          close ws
        </button>
        {channels.map((channel) => (
          <div key={Math.random()}>
            <p>Channel [{channel}] message:</p>
            <textarea
              value={messages[channel].join()}
              rows="15"
              cols="100"
              readOnly
            />
          </div>
        ))}
      </div>
    );
  }
}
