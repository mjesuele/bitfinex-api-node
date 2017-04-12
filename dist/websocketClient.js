'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _get = require('lodash/fp/get');

var _get2 = _interopRequireDefault(_get);

var _pipe = require('lodash/fp/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const withData = listener => (0, _pipe2.default)((0, _get2.default)(`data`), dataString => JSON.parse(dataString), listener);

class BitfinexAPIWebsocketClient {
  constructor({ key, secret }) {
    this.openSocket = onOpen => {
      const authNonce = Date.now() * 1000;
      const authPayload = `AUTH${authNonce}`;
      const authSig = _crypto2.default.createHmac(`sha384`, this.secret).update(authPayload).digest(`hex`);

      this.socket = new _ws2.default(this.url);

      const authParams = JSON.stringify({
        apiKey: this.key,
        authSig,
        authNonce,
        authPayload,
        event: `auth`
      });

      this.socket.addEventListener(`open`, (...args) => {
        console.log(`Connected to WebSocket API.`);
        if (typeof onOpen === `function`) onOpen(...args);
        if (this.hasCredentials) this.socket.send(authParams);
      });
    };

    this.addMessageListener = listener => this.socket && this.socket.addEventListener(`message`, withData(listener));

    this.removeMessageListener = listener => this.socket && this.socket.removeEventListener(`message`, withData(listener));

    this.addListener = (event, listener) => this.socket && this.socket.addEventListener(event, listener);

    this.removeListener = (event, listener) => this.socket && this.socket.addEventListener(event, listener);

    this.subscribeToChannel = (_ref) => {
      let channel = _ref.channel,
          params = _objectWithoutProperties(_ref, ['channel']);

      return this.socket && this.socket.send(JSON.stringify(_extends({
        channel
      }, params, {
        event: `subscribe`
      })));
    };

    this.unsubscribeFromChannel = chanId => this.socket && this.socket.send(JSON.stringify({
      event: `unsubscribe`,
      chanId
    }));

    this.key = key;
    this.secret = secret;
    this.url = `wss://api.bitfinex.com/ws`;
    this.hasCredentials = key && secret;
  }

}
exports.default = BitfinexAPIWebsocketClient;