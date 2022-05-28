const { PriceCoin } = require("../models/Pricecoin");
const got = require("got");

/**
 * Basic tokens
 * - Ethereum
 * - DAI
 * - USDT
 * - UBI
 */

const CMC_TOKENS_API = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
const CMC_CONVERSION_API = 'https://pro-api.coinmarketcap.com/v1/tools/price-conversion?amount=1'
const TOKEN_SYMBOLS = [
  'ETH',
  'DAI',
  'USDT',
  'UBI'
];
const TOKEN_NAMES = [
  'Dai',
  'Ethereum',
  'Universal Basic Income',
  'Tether'
];

async function loadBasicTokens() {
  const headers = {
    'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY
  };

  const response = await got.get(
      `${CMC_TOKENS_API}?symbol=${TOKEN_SYMBOLS.join(',')}`, { headers }).json();
  const { data } = response;
  const tokens = data.filter(row => TOKEN_NAMES.includes(row.name));
  let _copyTokens = [];

  for (const token of tokens) {
    const r = await got.get(
      `${CMC_CONVERSION_API}&symbol=${token.symbol}`, { headers }).json();
    
    const { quote } = r.data || { USD: { price: 0 } };
    _copyTokens.push({
      ...token,
      price: quote.USD.price
    });
  }
  return _copyTokens;
}

async function createOrUpdateTokens(loadedTokens=[]) {
  const today = new Date();
  for (const token of loadedTokens) {
    await PriceCoin.updateOne(
      { name: token.name },
      { 
        $set: {
          name: token.name,
          symbol: token.symbol,
          price: token.price || 0,
          token_address: (token.platform || {}).token_address,
          last_updated_at: today
        }
      },
      { upsert: true }
    );
  }
}

// All Prices
async function allPrices(_, res) {
  try {
    const loadedTokens = await loadBasicTokens();
    const now = new Date();
    const DIFF_MONTH = 1000 * 60 * 60 * 24 * 28;
    let prices = await PriceCoin.find({});

    if (!prices.length || (now - prices[0].last_updated_at) / 1000 > DIFF_MONTH) {
      await createOrUpdateTokens(loadedTokens);
      prices = await PriceCoin.find({});
    }
    return res.status(200).json(prices);
  } catch (error) {
    return res.status(404).json(error);
  }
}
 
module.exports = {
  allPrices
};