const store = require('electron-json-storage');

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

const queryCryptoPriceHistory = (event) => {
  let assets = store.getSync('crypto_assets');
  if (!assets || !Array.isArray(assets)) {
    assets = [];
  }
  store.set('crypto_assets', assets);
  event.reply('list_crypto_prices', assets);
};

const addCryptoAssets = (event, arg) => {
  let assets = store.getSync('crypto_assets');
  if (!assets || !Array.isArray(assets)) {
    assets = [];
  }

  let candidates = arg.assets;
  for (let i = 0; i < candidates.length; i++) {
    if (!candidates[i].id || !candidates[i].name) {
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
      break;
    }
  }

  store.set('crypto_assets', assets);
  event.reply('list_crypto_assets', assets);
};

const checkForDuplicate = (assets, candidate) => {
  for (let j = 0; j < assets.length; j++) {
    if (assets[j].name === candidate.name) {
      return true;
    }
  }
  return false;
};

exports.queryCryptoPriceHistory = queryCryptoPriceHistory;
exports.addCryptoAssets = addCryptoAssets;
exports.listAssets = listAssets;
exports.updateAsset = updateAsset;
