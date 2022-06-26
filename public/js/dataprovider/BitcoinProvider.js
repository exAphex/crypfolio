const fetch = require('node-fetch');
const api =
  'https://blockchain.coinmarketcap.com/api/address?symbol=BTC&address=';
const fetchSize = 10;

const getBitcoinTransactions = async (address, maxTransactionHash) => {
  let retData = [];

  if (!maxTransactionHash) {
    maxTransactionHash = '';
  }

  retData = await fetchTransactions(address, maxTransactionHash, 1);
  return retData;
};

const fetchTransactions = async (address, maxTransactionHash, start) => {
  const retTransactions = [];
  const responsePrice = await fetch(
    api + address + '&start=' + start + '&limit=' + fetchSize,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'Cryptfolio/1.0.0',
      },
    },
  );
  const jsonPrice = await responsePrice.json();
  if (jsonPrice.transaction_count && jsonPrice.txs) {
    let transactions = jsonPrice.txs;
    let transactionCount = jsonPrice.transaction_count;
    for (let i = 0; i < transactions.length; i++) {
      retTransactions.push(transactions[i]);
    }

    if (start + fetchSize < transactionCount) {
      let fetchedTransactions = await fetchTransactions(
        address,
        maxTransactionHash,
        start + fetchSize,
      );
      return retTransactions.concat(fetchedTransactions);
    }
  } else {
    throw new Error('Error on data: ' + JSON.stringify(jsonPrice));
  }
  return retTransactions;
};

exports.getBitcoinTransactions = getBitcoinTransactions;
