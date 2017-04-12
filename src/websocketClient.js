import WebSocket from 'ws';
import crypto from 'crypto';
import get from 'lodash/fp/get';
import pipe from 'lodash/fp/pipe';

const withData = listener => pipe(
  get(`data`),
  dataString => JSON.parse(dataString),
  listener,
);

export default class BitfinexAPIWebsocketClient {
  constructor({ key, secret }) {
    this.key = key;
    this.secret = secret;
    this.url = `wss://api.bitfinex.com/ws`;
    this.hasCredentials = key && secret;
  }

  openSocket = onOpen => {
    const authNonce = Date.now() * 1000;
    const authPayload = `AUTH${authNonce}`;
    const authSig = crypto
      .createHmac(`sha384`, this.secret)
      .update(authPayload)
      .digest(`hex`);

    this.socket = new WebSocket(this.url);

    const authParams = JSON.stringify({
      apiKey: this.key,
      authSig,
      authNonce,
      authPayload,
      event: `auth`,
    });

    this.socket.addEventListener(`open`, (...args) => {
      console.log(`Connected to WebSocket API.`);
      if (typeof onOpen === `function`) onOpen(...args);
      if (this.hasCredentials) this.socket.send(authParams);
    });
  }

  addMessageListener = listener => this.socket
    && this.socket.addEventListener(`message`, withData(listener));

  removeMessageListener = listener => this.socket
    && this.socket.removeEventListener(`message`, withData(listener));

  addListener = (event, listener) => this.socket
    && this.socket.addEventListener(event, listener);

  removeListener = (event, listener) => this.socket
    && this.socket.addEventListener(event, listener);

  subscribeToChannel = ({ channel, ...params }) => this.socket
    && this.socket.send(JSON.stringify({
      channel,
      ...params,
      event: `subscribe`,
    }))

  unsubscribeFromChannel = chanId => this.socket
    && this.socket.send(JSON.stringify({
      event: `unsubscribe`,
      chanId,
    }))
}
