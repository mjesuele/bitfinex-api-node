'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _websocketClient = require('./websocketClient');

var _websocketClient2 = _interopRequireDefault(_websocketClient);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _createRequestConfig = require('./createRequestConfig');

var _createRequestConfig2 = _interopRequireDefault(_createRequestConfig);

var _get = require('lodash/fp/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const beginningOfTime = 0;

class BitfinexAPI {

  constructor({ key, secret } = {}) {
    this.requestPublic = (endpoint, params = {}) => _axios2.default.get(`${this.baseUrl}/v1${endpoint}`, { params }).then((0, _get2.default)(`data`)).catch(err => Promise.reject(err.response.data));

    this.requestPrivate = (endpoint, params = {}) => {
      if (!this.key || !this.secret) {
        throw new Error(`API key and secret key required to use authenticated methods`);
      }

      const requestPath = `/v1${endpoint}`;
      const requestUrl = `${this.baseUrl}${requestPath}`;

      const payload = _extends({
        nonce: Date.now().toString(),
        request: requestPath
      }, params);

      const config = (0, _createRequestConfig2.default)({
        payload,
        key: this.key,
        secret: this.secret
      });

      return _axios2.default.post(requestUrl, {}, config).then((0, _get2.default)(`data`)).catch(err => Promise.reject(err.response.data));
    };

    this.getAllSymbols = () => this.requestPublic(`/symbols`);

    this.getAllSymbolsDetails = () => this.requestPublic(`/symbols_details`);

    this.getTicker = symbol => this.requestPublic(`/pubticker/${symbol}`);

    this.getStats = symbol => this.requestPublic(`/stats/${symbol}`);

    this.getOrderBook = (symbol, params = {}) => this.requestPublic(`/book/${symbol}`, params);

    this.getFundingBook = (currency, params = {}) => this.requestPublic(`/lendbook/${currency}`, params);

    this.getTradeHistory = (symbol, params = {}) => this.requestPublic(`/trades/${symbol}`, params);

    this.getLendHistory = (currency, params = {}) => this.requestPublic(`/lends/${currency}`, params);

    this.getAccountInfo = () => this.requestPrivate(`/account_infos`);

    this.getSummary = () => this.requestPrivate(`/summary`);

    this.getDepositAddress = (_ref = {}) => {
      let method = _ref.method,
          wallet_name = _ref.wallet_name,
          params = _objectWithoutProperties(_ref, ['method', 'wallet_name']);

      return this.requestPrivate(`/deposit/new`, _extends({ method, wallet_name }, params));
    };

    this.getKeyPermissions = () => this.requestPrivate(`/key_info`);

    this.getMarginInfo = () => this.requestPrivate(`/margin_infos`);

    this.getWalletBalances = () => this.requestPrivate(`/balances`);

    this.transferBetweenWallets = ({ amount, currency, walletfrom, walletto } = {}) => this.requestPrivate(`/transfer`, { amount, currency, walletfrom, walletto });

    this.withdrawFunds = (params = {}) => this.requestPrivate(`/withdraw`, params);

    this.newOrder = (params = {}) => this.requestPrivate(`/order/new`, params);

    this.multipleNewOrders = (orders = []) => this.requestPrivate(`/order/new/multi`, orders);

    this.cancelOrder = ({ order_id } = {}) => this.requestPrivate(`/order/cancel`, { order_id });

    this.cancelMultipleOrders = (orders = []) => this.requestPrivate(`/order/cancel/multi`, orders);

    this.cancelAllActiveOrders = () => this.requestPrivate(`/order/cancel/all`);

    this.replaceOrder = (_ref2 = {}) => {
      let order_id = _ref2.order_id,
          params = _objectWithoutProperties(_ref2, ['order_id']);

      return this.requestPrivate(`/order/cancel/replace`, _extends({ order_id }, params));
    };

    this.getMyOrderStatus = ({ order_id } = {}) => this.requestPrivate(`/order/status`, { order_id });

    this.getMyActiveOrders = () => this.requestPrivate(`/orders`);

    this.getMyPastOrders = () => this.requestPrivate(`/orders/hist`);

    this.getMyActivePositions = () => this.requestPrivate(`/positions`);

    this.claimMyPosition = ({ amount, position_id }) => this.requestPrivate(`/position/claim`, { amount, position_id });

    this.getMyBalanceHistory = (_ref3) => {
      let currency = _ref3.currency,
          params = _objectWithoutProperties(_ref3, ['currency']);

      return this.requestPrivate(`/history`, _extends({ currency }, params));
    };

    this.getMyDepositWithdrawalHistory = (_ref4) => {
      let currency = _ref4.currency,
          params = _objectWithoutProperties(_ref4, ['currency']);

      return this.requestPrivate(`/history/movements`, _extends({ currency }, params));
    };

    this.getMyPastTrades = (_ref5 = {}) => {
      let symbol = _ref5.symbol;
      var _ref5$timestamp = _ref5.timestamp;

      let timestamp = _ref5$timestamp === undefined ? beginningOfTime : _ref5$timestamp,
          params = _objectWithoutProperties(_ref5, ['symbol', 'timestamp']);

      return this.requestPrivate(`/mytrades`, _extends({ symbol, timestamp }, params));
    };

    this.newOffer = (params = {}) => this.requestPrivate(`/offer/new`, params);

    this.cancelOffer = ({ order_id }) => this.requestPrivate(`/offer/cancel`, { order_id });

    this.getMyOfferStatus = ({ order_id }) => this.requestPrivate(`/offer/status`, { order_id });

    this.getMyActiveCredits = () => this.requestPrivate(`/credits`);

    this.getMyActiveOffers = () => this.requestPrivate(`/offers`);

    this.getMyTakenUsedFunds = () => this.requestPrivate(`/taken_funds`);

    this.getMyTakenUnusedFunds = () => this.requestPrivate(`/unused_taken_funds`);

    this.getMyTotalTakenFunds = () => this.requestPrivate(`/total_taken_funds`);

    this.closeFunding = ({ swap_id }) => this.requestPrivate(`/funding/close`, { swap_id });

    this.key = key;
    this.secret = secret;
    this.baseUrl = `https://api.bitfinex.com`;
  }

  // Public API


  // Authenticated API

  // Orders API

  // Positions API

  // Historical Data API

  // Margin Funding API

}
exports.default = BitfinexAPI;
BitfinexAPI.WebsocketClient = _websocketClient2.default;