const store = require('electron-json-storage');
const CoinGeckoProvider = require('../dataprovider/CoinGeckoProvider');

const listAssets = (event) => {
  let assets = store.getSync('crypto_assets');
  if (!assets || !Array.isArray(assets)) {
    assets = [];
  }
  for (let i = 0; i < assets.length; i++) {
    if (assets[i].latestUpdate) {
      assets[i].latestUpdate = new Date(assets[i].latestUpdate);
    }
  }
  event.reply('list_crypto_assets', assets);
};

const getAsset = (event, id) => {
  let assets = store.getSync('crypto_assets');
  let retAsset = null;
  if (!assets || !Array.isArray(assets)) {
    assets = [];
  }
  for (let i = 0; i < assets.length; i++) {
    if (assets[i].id === id) {
      retAsset = assets[i];
      break;
    }
  }
  event.reply('get_crypto_asset', retAsset);
};

const queryCryptoPriceHistory = async (event, arg) => {
  let assets = store.getSync('crypto_assets');
  if (!assets || !Array.isArray(assets)) {
    assets = [];
  }
  for (let i = 0; i < assets.length; i++) {
    if (assets[i].id === arg.id) {
      assets[i] = await softQueryPriceData(assets[i]);
      store.set('crypto_assets', assets);
      return assets[i];
    }
  }

  return null;
};

const addCryptoAssets = (event, arg) => {
  let assets = store.getSync('crypto_assets');
  if (!assets || !Array.isArray(assets)) {
    assets = [];
  }

  let candidates = arg.assets;
  for (let i = 0; i < candidates.length; i++) {
    if (!candidates[i].id || !candidates[i].name || !candidates[i].symbol) {
      continue;
    }

    if (!checkForDuplicate(assets, candidates[i])) {
      candidates[i].latestUpdate = new Date(0).getTime();
      assets.push(candidates[i]);
    }
  }

  store.set('crypto_assets', assets);
  event.reply('list_crypto_assets', assets);
};

const updateAsset = (event, arg) => {
  let assets = store.getSync('crypto_assets');
  if (!assets || !Array.isArray(assets)) {
    assets = [];
  }

  for (let i = 0; i < assets.length; i++) {
    if (assets[i].id === arg.id) {
      assets[i].name = arg.name;
      assets[i].description = arg.description;
      assets[i].dataProvider = {
        id: arg.dataProvider.id,
        name: arg.dataProvider.name,
        queryIdentifier: arg.dataProvider.queryIdentifier,
      };
      break;
    }
  }

  store.set('crypto_assets', assets);
  event.reply('list_crypto_assets', assets);
};

const checkForDuplicate = (assets, candidate) => {
  for (let j = 0; j < assets.length; j++) {
    if (toLowerCase(assets[j].symbol) === toLowerCase(candidate.symbol)) {
      return true;
    }
  }
  return false;
};

// tolowercase util
const toLowerCase = (str) => {
  if (str && str.toLowerCase) {
    return str.toLowerCase();
  } else {
    return null;
  }
};

const softQueryPriceData = async (asset) => {
  if (
    !asset.dataProvider.queryIdentifier ||
    asset.dataProvider.queryIdentifier === ''
  ) {
    throw 'No dataprovider or identifier set!';
  }
  var today = new Date();
  var maxDate = 0;
  if (asset.prices && asset.prices.length > 0) {
    var sortedPrices = asset.prices.sort((l, u) => {
      return l.date < u.date ? 1 : -1;
    });
    maxDate = sortedPrices[0].date;
  }
  var queryData = await CoinGeckoProvider.getCoinPricesBetween(
    asset.dataProvider.queryIdentifier,
    maxDate,
    today.getTime(),
    'eur',
  );

  asset.prices = mergePriceData(asset.prices, queryData);
  asset.latestUpdate = today.getTime();
  return asset;
};

const mergePriceData = (prices, queriedPrices) => {
  var sortedPrices = queriedPrices.sort((l, u) => {
    return l.date > u.date ? 1 : -1;
  });
  if (!prices) {
    prices = [];
  }
  for (var i = 0; i < sortedPrices.length; i++) {
    prices = CoinGeckoProvider.upsertTimeData(
      prices,
      sortedPrices[i].date,
      sortedPrices[i].value,
    );
  }
  return prices;
};

exports.queryCryptoPriceHistory = queryCryptoPriceHistory;
exports.addCryptoAssets = addCryptoAssets;
exports.listAssets = listAssets;
exports.updateAsset = updateAsset;
exports.getAsset = getAsset;
