import React, {Component} from 'react';
import {HashRouter, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/home';
import CryptoOverview from './pages/crypto/CryptoOverview';
import InfoOverview from './pages/info';
import CryptoAccountDetail from './pages/crypto/CryptoAccountDetail';
import AssetOverview from './pages/asset/AssetOverview';
import CryptoAssetDetail from './pages/asset/CryptoAssetDetail';

type MainPageState = {selectedNavItem: string};

export class MainPage extends Component<{}, MainPageState> {
  state = {selectedNavItem: 'DASHBOARD'};

  getSelectedBg(item: string) {
    if (item === this.state.selectedNavItem) {
      return 'bg-gray-100';
    } else {
      return '';
    }
  }

  setSelected(item: string) {
    this.setState({selectedNavItem: item});
  }

  render() {
    return (
      <HashRouter basename="/">
        <div className="flex">
          <div className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto border-r">
            <h2 className="text-3xl font-semibold text-center text-blue-800">
              Crypfolio
            </h2>
            <div className="flex flex-col justify-between mt-6">
              <aside>
                <ul>
                  <li>
                    <Link
                      className={
                        'flex items-center px-4 py-2 text-gray-700 ' +
                        this.getSelectedBg('DASHBOARD') +
                        ' rounded-md hover:bg-gray-200'
                      }
                      onClick={() => {
                        this.setSelected('DASHBOARD');
                      }}
                      to="/"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>

                      <span className="mx-4 font-medium">Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        'flex items-center px-4 py-2 mt-5 text-gray-600 ' +
                        this.getSelectedBg('CRYPTOS') +
                        ' rounded-md hover:bg-gray-200'
                      }
                      onClick={() => {
                        this.setSelected('CRYPTOS');
                      }}
                      to="/cryptos"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>

                      <span className="mx-4 font-medium">Accounts</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        'flex items-center px-4 py-2 mt-5 text-gray-600 ' +
                        this.getSelectedBg('ASSETS') +
                        ' rounded-md hover:bg-gray-200'
                      }
                      onClick={() => {
                        this.setSelected('ASSETS');
                      }}
                      to="/assets"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>

                      <span className="mx-4 font-medium">Assets</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        'flex items-center px-4 py-2 mt-5 text-gray-600 ' +
                        this.getSelectedBg('SETTINGS') +
                        ' rounded-md hover:bg-gray-200'
                      }
                      onClick={() => {
                        this.setSelected('SETTINGS');
                      }}
                      to="/settings"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>

                      <span className="mx-4 font-medium">Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={
                        'flex items-center px-4 py-2 mt-5 text-gray-600 ' +
                        this.getSelectedBg('INFO') +
                        ' rounded-md hover:bg-gray-200'
                      }
                      onClick={() => {
                        this.setSelected('INFO');
                      }}
                      to="/info"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>

                      <span className="mx-4 font-medium">Info</span>
                    </Link>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
          <div className="w-full max-h-full overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cryptos" element={<CryptoOverview />} />
              <Route path="/info" element={<InfoOverview />} />
              <Route path="/assets" element={<AssetOverview />} />
              <Route
                path="/cryptodetail/:id"
                element={<CryptoAccountDetail />}
              />
              <Route path="/cryptoasset/:id" element={<CryptoAssetDetail />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default MainPage;
