const store = require('electron-json-storage');
const { getBitcoinTransactions } = require('../dataprovider/BitcoinProvider.js');

const listAccounts = (event) => {
  let accountFile = store.getSync('crypto_accounts');
  var accounts = [];
  if (
    accountFile &&
    accountFile.accounts &&
    Array.isArray(accountFile.accounts)
  ) {
    accounts = accountFile.accounts;
  }
  return accounts;
};

const getAccount = (event, id) => {
  let retAccount = null;
  let accountFile = store.getSync('crypto_accounts');
  var accounts = [];
  if (
    accountFile &&
    accountFile.accounts &&
    Array.isArray(accountFile.accounts)
  ) {
    accounts = accountFile.accounts;
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
  let accountFile = store.getSync('crypto_accounts');
  var accounts = [];
  if (
    accountFile &&
    accountFile.accounts &&
    Array.isArray(accountFile.accounts)
  ) {
    accounts = accountFile.accounts;
  }

  accounts.push(arg);
  accountFile.accounts = accounts;

  store.set('crypto_accounts', accountFile);
  event.reply('list_crypto_accounts', accounts);
};

const updateAccount = (event, arg) => {
  let accountFile = store.getSync('crypto_accounts');
  var accounts = [];
  if (
    accountFile &&
    accountFile.accounts &&
    Array.isArray(accountFile.accounts)
  ) {
    accounts = accountFile.accounts;
  }

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === arg.id) {
      accounts[i].name = arg.name;
      accounts[i].description = arg.description;
      accounts[i].address = arg.address;
      break;
    }
  }

  accountFile.accounts = accounts;

  store.set('crypto_accounts', accountFile);
  event.reply('list_crypto_accounts', accounts);
};

const addAccountTransactions = (event, arg) => {
  let retAcc = null;
  let accountFile = store.getSync('crypto_accounts');
  var accounts = [];
  if (
    accountFile &&
    accountFile.accounts &&
    Array.isArray(accountFile.accounts)
  ) {
    accounts = accountFile.accounts;
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

  accountFile.accounts = accounts;

  store.set('crypto_accounts', accountFile);
  event.reply('get_crypto_account', retAcc);
};

const deleteAccount = (event, arg) => {
  let accountFile = store.getSync('crypto_accounts');
  var accounts = [];
  if (
    accountFile &&
    accountFile.accounts &&
    Array.isArray(accountFile.accounts)
  ) {
    accounts = accountFile.accounts;
  }

  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === arg.id) {
      accounts.splice(i, 1);
      break;
    }
  }

  accountFile.accounts = accounts;

  store.set('crypto_accounts', accountFile);
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

const queryCryptoAccountHistory = (id) => {
  let accountFile = store.getSync('crypto_accounts');
  var accounts = [];
  if (
    accountFile &&
    accountFile.accounts &&
    Array.isArray(accountFile.accounts)
  ) {
    accounts = accountFile.accounts;
  }
  for (let i = 0; i < accounts.length; i++) {
    if (accounts[i].id === id) {
      return getBitcoinTransactions('34QaGHBL9LWcxX4QHaR4ymwkUNW1zhyjt5','');
    }
  }
  return [];
};

exports.listAccounts = listAccounts;
exports.addAccount = addAccount;
exports.deleteAccount = deleteAccount;
exports.updateAccount = updateAccount;
exports.getAccount = getAccount;
exports.addAccountTransactions = addAccountTransactions;
exports.queryCryptoAccountHistory = queryCryptoAccountHistory;
