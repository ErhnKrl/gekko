
// - Feeding candles to a trading method

var _ = require('lodash');
var log = require('./log.js');
var moment = require('moment');
var utc = moment.utc;

var exchangeChecker = require('./exchangeChecker');

var util = require('./util');
var config = util.getConfig();

var Manager = function() {
  _.bindAll(this);

  this.exchange = exchangeChecker.settings(config.watch);
  this.model = require('./databaseManager');
  this.model.setRealCandleSize(config.EMA.interval);

  if(!config.backtest.enabled) {
    // watch the market
    var TradeFetcher = require('./tradeFetcher');
    this.fetcher = new TradeFetcher;
    // we pass a fetch to the model right away
    // so it knows how new the history needs to be
    this.fetcher.once('new trades', this.model.init);
    // this.fetcher.on('new trades', this.model.processTrades);

    this.model.on('history', this.processHistory);

  } else
    console.log('WUP WUP this.backtest();');

}

Manager.prototype.setupAdvice = function() {
  console.log('we got all history we need, lets rock');
}

Manager.prototype.processHistory = function(history) {
  // if history is not in this region we should discard
  var minimum = util.intervalsAgo(config.EMA.candles);

  if(!this.exchange.providesHistory) {

    if(history.empty) {
      // we are just going to fetch because we don't have
      // any history yet.
      log.info('No history found, starting to build one now');
    } else if(!history.complete) {
      log.info('History found, but not enough to start giving advice');
    } else {
      log.info('Full history available');
      console.log('GOT FULL HISTORY, SIZE:', history.candles.length);
    }
  }

}

// we don't got any history and we can't get it
// from the exchange, watch until we fetched for
// interval * candles
Manager.prototype.sleep = function(ms) {
  console.log('we are going to wait a loooong time :(', ms);
}

Manager.prototype.fetchHistory = function(since) {
 console.log('we dont got any history, so lets fetch it!', since); 
}


// var a = new Manager;
module.exports = Manager;