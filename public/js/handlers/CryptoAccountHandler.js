const store = require('electron-json-storage');

const listAccounts = (event) => {
  let accounts = store.getSync('crypto_accounts');
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }
  return accounts;
};

const getAccount = (event, id) => {
  let accounts = store.getSync('crypto_accounts');
  let retAccount = null;
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === id) {
      retAccount = accounts[i];
      break;
    }
  }
  event.reply('get_crypto_account', retAccount);
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

const updateAccount = (event, arg) => {
  let accounts = store.getSync('crypto_accounts');
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === arg.id) {
      accounts[i].name = arg.name;
      accounts[i].description = arg.description;
      accounts[i].address = arg.address;
      break;
    }
  }

  store.set('crypto_accounts', accounts);
  event.reply('list_crypto_accounts', accounts);
};

const addAccountTransactions = (event, arg) => {
  let accounts = store.getSync('crypto_accounts');
  let retAcc = null;
  if (!accounts || !Array.isArray(accounts)) {
    accounts = [];
  }

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === arg.id) {
      if (!accounts[i].transactions) {
        accounts[i].transactions = [];
      }
      if (!arg.transactions) {
        arg.transactions = [];
      }
      for (let j = 0; j < arg.transactions.length; j++) {
        if (
          !checkDuplicateTransaction(
            accounts[i].transactions,
            arg.transactions[j],
          )
        ) {
          accounts[i].transactions.push(arg.transactions[j]);
        }
      }
      retAcc = accounts[i];
      break;
    }
  }

  store.set('crypto_accounts', accounts);
  event.reply('get_crypto_account', retAcc);
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

const checkDuplicateTransaction = (transactions, t) => {
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id === t.id) {
      return true;
    }
  }
  return false;
};

exports.listAccounts = listAccounts;
exports.addAccount = addAccount;
exports.deleteAccount = deleteAccount;
exports.updateAccount = updateAccount;
exports.getAccount = getAccount;
exports.addAccountTransactions = addAccountTransactions;
