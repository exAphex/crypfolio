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
  retData = translateTransactions(address, retData);
  return retData;
};

const translateTransactions = (address, transactions) => {
  let retTransactions = [];
  for (let i = 0; i < transactions.length; i++) {
    const incomingElements = findInArray(transactions[i].outputs, address);
    if (incomingElements.length > 0) {
      let incomingTotal = 0;
      for (let j = 0; j < incomingElements.length; j++) {
        incomingTotal += incomingElements[j].value * 1;
      }
      retTransactions.push({id: transactions[i].hash, symbol:'BTC',date: transactions[i].timestamp * 1000, type: 0, amount: (incomingTotal * 1) / 100000000}); 
    }

    const outgoinElements = findInArray(transactions[i].inputs, address);
    if (outgoinElements.length > 0) {
      let outgoingTotal = 0;
      for (let j = 0; j < outgoinElements.length; j++) {
        outgoingTotal += outgoinElements[j].value * -1;
      }
      retTransactions.push({id: transactions[i].hash, symbol:'BTC', date: transactions[i].timestamp * 1000, type: 1, amount: (outgoingTotal * 1) / 100000000});
    }
  }
  return retTransactions;
}

const findInArray = (arr, address) => {
  const retItems = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].address.toLowerCase() === address.toLowerCase()) {
      retItems.push(arr[i]);
    }
  }
  return retItems;
}

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
      if (transactions[i].hash.toLowerCase() === maxTransactionHash.toLowerCase()) {
        return retTransactions;
      }
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
