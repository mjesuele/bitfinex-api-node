import WebsocketClient from './websocketClient';
import axios from 'axios';
import createRequestConfig from './createRequestConfig';
import get from 'lodash/fp/get';

const beginningOfTime = 0;

export default class BitfinexAPI {
  static WebsocketClient = WebsocketClient;

  constructor({ key, secret } = {}) {
    this.key = key;
    this.secret = secret;
    this.baseUrl = `https://api.bitfinex.com`;
  }

  requestPublic = (endpoint, params = {}) =>
    axios.get(`${this.baseUrl}/v1${endpoint}`, { params })
      .then(get(`data`))
      .catch(err => Promise.reject(err.response.data));

  requestPrivate = (endpoint, params = {}) => {
    if (!this.key || !this.secret) {
      throw new Error(
        `API key and secret key required to use authenticated methods`,
      );
    }

    const requestPath = `/v1${endpoint}`;
    const requestUrl = `${this.baseUrl}${requestPath}`;

    const payload = {
      nonce: Date.now().toString(),
      request: requestPath,
      ...params,
    };

    const config = createRequestConfig({
      payload,
      key: this.key,
      secret: this.secret,
    });

    return axios.post(requestUrl, {}, config)
      .then(get(`data`))
      .catch(err => Promise.reject(err.response.data));
  }

  // Public API
  getAllSymbols = () =>
    this.requestPublic(`/symbols`)

  getAllSymbolsDetails = () =>
    this.requestPublic(`/symbols_details`)

  getTicker = symbol =>
    this.requestPublic(`/pubticker/${symbol}`)

  getStats = symbol =>
    this.requestPublic(`/stats/${symbol}`)

  getOrderBook = (symbol, params = {}) =>
    this.requestPublic(`/book/${symbol}`, params)

  getFundingBook = (currency, params = {}) =>
    this.requestPublic(`/lendbook/${currency}`, params)

  getTradeHistory = (symbol, params = {}) =>
    this.requestPublic(`/trades/${symbol}`, params)

  getLendHistory = (currency, params = {}) =>
    this.requestPublic(`/lends/${currency}`, params)

  // Authenticated API

  getAccountInfo = () =>
    this.requestPrivate(`/account_infos`)

  getSummary = () =>
    this.requestPrivate(`/summary`)

  getDepositAddress = ({ method, wallet_name, ...params } = {}) =>
    this.requestPrivate(`/deposit/new`, { method, wallet_name, ...params })

  getKeyPermissions = () =>
    this.requestPrivate(`/key_info`)

  getMarginInfo = () =>
    this.requestPrivate(`/margin_infos`)

  getWalletBalances = () =>
    this.requestPrivate(`/balances`)

  transferBetweenWallets = ({ amount, currency, walletfrom, walletto } = {}) =>
    this.requestPrivate(`/transfer`, { amount, currency, walletfrom, walletto })

  withdrawFunds = (params = {}) =>
    this.requestPrivate(`/withdraw`, params)

  // Orders API

  newOrder = (params = {}) =>
    this.requestPrivate(`/order/new`, params)

  multipleNewOrders = (orders = []) =>
    this.requestPrivate(`/order/new/multi`, orders)

  cancelOrder = ({ order_id } = {}) =>
    this.requestPrivate(`/order/cancel`, { order_id })

  cancelMultipleOrders = (orders = []) =>
    this.requestPrivate(`/order/cancel/multi`, orders)

  cancelAllActiveOrders = () =>
    this.requestPrivate(`/order/cancel/all`)

  replaceOrder = ({ order_id, ...params } = {}) =>
    this.requestPrivate(`/order/cancel/replace`, { order_id, ...params })

  getMyOrderStatus = ({ order_id } = {}) =>
    this.requestPrivate(`/order/status`, { order_id })

  getMyActiveOrders = () =>
    this.requestPrivate(`/orders`)

  getMyPastOrders = () =>
    this.requestPrivate(`/orders/hist`)

  // Positions API

  getMyActivePositions = () =>
    this.requestPrivate(`/positions`)

  claimMyPosition = ({ amount, position_id }) =>
    this.requestPrivate(`/position/claim`, { amount, position_id })

  // Historical Data API

  getMyBalanceHistory = ({ currency, ...params }) =>
    this.requestPrivate(`/history`, { currency, ...params })

  getMyDepositWithdrawalHistory = ({ currency, ...params }) =>
    this.requestPrivate(`/history/movements`, { currency, ...params })

  getMyPastTrades = ({ symbol, timestamp = beginningOfTime, ...params } = {}) =>
    this.requestPrivate(`/mytrades`, { symbol, timestamp, ...params })

  // Margin Funding API

  newOffer = (params = {}) =>
    this.requestPrivate(`/offer/new`, params)

  cancelOffer = ({ order_id }) =>
    this.requestPrivate(`/offer/cancel`, { order_id })

  getMyOfferStatus = ({ order_id }) =>
    this.requestPrivate(`/offer/status`, { order_id })

  getMyActiveCredits = () =>
    this.requestPrivate(`/credits`)

  getMyActiveOffers = () =>
    this.requestPrivate(`/offers`)

  getMyTakenUsedFunds = () =>
    this.requestPrivate(`/taken_funds`)

  getMyTakenUnusedFunds = () =>
    this.requestPrivate(`/unused_taken_funds`)

  getMyTotalTakenFunds = () =>
    this.requestPrivate(`/total_taken_funds`)

  closeFunding = ({ swap_id }) =>
    this.requestPrivate(`/funding/close`, { swap_id })

}
