const store = require('electron-json-storage');

const queryCryptoPriceHistory = (event) => {
  let assets = store.getSync('crypto_prices');
  if (!assets || !Array.isArray(assets)) {
    assets = [];
  }
  store.set('crypto_prices', assets);
  event.reply('list_crypto_prices', assets);
};

exports.queryCryptoPriceHistory = queryCryptoPriceHistory;
