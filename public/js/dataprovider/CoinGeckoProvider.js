const fetch = require('node-fetch');
const priceAPI = 'https://api.coingecko.com/api/v3/coins/';

const getCoinPricesBetween = async (coinId, from, to, currency) => {
  let retData = [];
  const responsePrice = await fetch(
    priceAPI +
      coinId +
      '/market_chart/range?vs_currency=' +
      currency +
      '&from=' +
      from / 1000 +
      '&to=' +
      to / 1000,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'PostmanRuntime/7.26.8',
      },
    },
  );
  const jsonPrice = await responsePrice.json();
  if (jsonPrice.prices && jsonPrice.prices.length > 0) {
    var sortedPrices = jsonPrice.prices.sort((l, u) => {
      return l[0] < u[0] ? 1 : -1;
    });
    for (var i = 0; i < sortedPrices.length; i++) {
      const tempDate = new Date(sortedPrices[i][0]);
      tempDate.setHours(0);
      tempDate.setMinutes(0);
      tempDate.setSeconds(0);
      tempDate.setMilliseconds(0);
      retData = upsertTimeData(retData, tempDate.getTime(), sortedPrices[i][1]);
    }
  }
  return retData;
};

const upsertTimeData = (arrData, date, value) => {
  for (var i = 0; i < arrData.length; i++) {
    if (arrData[i].date === date) {
      arrData[i].value = value;
      return arrData;
    }
  }
  arrData.push({date: date, value: value});
  return arrData;
};

exports.getCoinPricesBetween = getCoinPricesBetween;
exports.upsertTimeData = upsertTimeData;
