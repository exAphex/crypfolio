const Bluebird = require('bluebird');
const store = Bluebird.promisifyAll(require('electron-json-storage'));
const migrateAccountsFile = async () => {
  let accountsFile = store.getSync('crypto_accounts');

  if (!accountsFile) {
    accountsFile = {};
    await store.setAsync('crypto_accounts', accountsFile);
    return false;
  }

  switch (accountsFile.version) {
    case undefined: {
      var retFile = {};
      if (accountsFile.length > 0) {
        retFile.accounts = accountsFile;
      } else {
        retFile.accounts = [];
      }
      retFile.version = '1';

      await store.setAsync('crypto_accounts', retFile);
      return false;
    }
    case '1': {
      for (let i = 0; i < accountsFile.accounts.length; i++) {
        if (!accountsFile.accounts[i].type.source) {
          accountsFile.accounts[i].type.source = 0;
        }
      }
      accountsFile.version = '2';
      await store.setAsync('crypto_accounts', accountsFile);
      return false;
    }
    case '2': {
      return true;
    }
  }
};

exports.migrateAccountsFile = migrateAccountsFile;
