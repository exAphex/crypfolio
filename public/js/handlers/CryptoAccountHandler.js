const store = require('electron-json-storage');

const listAccounts = (event) => {
  let accounts = store.getSync('crypto_accounts');
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }
  event.reply('list_crypto_accounts', accounts);
};

const addAccount = (event, arg) => {
  let accounts = store.getSync('crypto_accounts');
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  accounts.push(arg);

  store.set('crypto_accounts', accounts);
  event.reply('list_crypto_accounts', accounts);
};

const deleteAccount = (event, arg) => {
  let accounts = store.getSync('crypto_accounts');
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === arg.id) {
      accounts.splice(i, 1);
      break;
    }
  }

  store.set('crypto_accounts', accounts);
  event.reply('list_crypto_accounts', accounts);
};

exports.listAccounts = listAccounts;
exports.addAccount = addAccount;
exports.deleteAccount = deleteAccount;
