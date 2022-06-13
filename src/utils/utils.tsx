import krakenLogo from '../assets/kraken.png';
import binanceLogo from '../assets/binance.ico';
import React from 'react';
import {CryptoAccountType} from '../components/models/cryptoaccount';

export function getIconByAccountType(type: CryptoAccountType) {
  if (!type) {
    return null;
  }

  switch (type.id) {
    case 'BINANCE':
      return <img width="24" height="24" src={binanceLogo} alt="GetIncome" />;
    case 'KRAKEN':
      return <img width="24" height="24" src={krakenLogo} alt="LendSecured" />;

    default:
      return null;
  }
}

export function lowerCase(data: string) {
  if (data === null || data === undefined) {
    return null;
  } else {
    return data.toLowerCase();
  }
}

export function formatError(e: any) {
  if (!e) {
    return '';
  }

  if (e instanceof String) {
    return e;
  }

  if (e.message) {
    return e.message;
  }

  return 'Unkown error!';
}
