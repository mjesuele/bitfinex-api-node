# bitfinex-api

Bitfinex cryptocurrency exchange API wrapper for Node.js

## Installation

```
yarn add bitfinex-api
```

## Usage

Clients for both the v1 [REST API](https://bitfinex.readme.io/v1/docs/rest-general)
and v1 [streaming WebSocket API](https://bitfinex.readme.io/v1/docs/ws-general)
are included. Private endpoints as indicated in the API docs require authentication
with an API key and secret key.

### Example usage:

```javascript
import BitfinexAPI from 'bitfinex-api';

const restClient = new BitfinexAPI({ key, secret });
const websocketClient =
  new BitfinexAPI.WebsocketClient({ key, secret });

restClient.getOrderBook('BTCUSD', { limit_asks: 10, limit_bids: 10 })
  .then(console.log)
  .catch(console.error);

websocketClient.openSocket(() => {
  websocketClient.addMessageListener(data =>
    doSomethingCool(data)
  );
  websocketClient.subscribeToChannel({
    channel: 'trades',
    pair: 'BTCUSD',
  })
})

// The methods are bound properly, so feel free to destructure them:
const { getTicker } = restClient;
getTicker('btcusd')
  .then(data =>
    console.log(`Last trade: $${data.last} / BTC`)
  )
```

## API

### REST
* All methods return promises.
* getAllSymbols() 
* getAllSymbolsDetails() 
* getTicker(symbol) 
* getStats(symbol) 
* getOrderBook(symbol, params = {}) 
* getFundingBook(currency, params = {}) 
* getTradeHistory(symbol, params = {}) 
* getLendHistory(currency, params = {}) 
* getAccountInfo() 
* getSummary() 
* getDepositAddress({ method, wallet_name, ...params } = {}) 
* getKeyPermissions() 
* getMarginInfo() 
* getWalletBalances() 
* transferBetweenWallets({ amount, currency, walletfrom, walletto } = {}) 
* withdrawFunds(params = {}) 
* newOrder(params = {}) 
* multipleNewOrders(orders = []) 
* cancelOrder({ order_id } = {}) 
* cancelMultipleOrders(orders = []) 
* cancelAllActiveOrders() 
* replaceOrder({ order_id, ...params } = {}) 
* getMyOrderStatus({ order_id } = {}) 
* getMyActiveOrders() 
* getMyActivePositions() 
* claimMyPosition({ amount, position_id }) 
* getMyBalanceHistory({ currency, ...params }) 
* getMyDepositWithdrawalHistory({ currency, ...params }) 
* getMyPastTrades({ symbol, timestamp = beginningOfTime, ...params } = {}) 
* newOffer(params = {}) 
* cancelOffer({ order_id }) 
* getMyOfferStatus({ order_id }) 
* getMyActiveCredits() 
* getMyActiveOffers() 
* getMyTakenUsedFunds() 
* getMyTakenUnusedFunds() 
* getMyTotalTakenFunds() 
* closeFunding({ swap_id }) 

### WebSocket
* openSocket(onOpen)
* addMessageListener(listener)
* removeMessageListener(listener)
* addListener(event, listener)
* removeListener(event, listener)
* subscribeToChannel({ channel, ...params })
* unsubscribeFromChannel(chanId)

## To Do
* Tests (I've started on this)
* Improved documentation
* More robust error handling

Feedback and pull requests welcome!
