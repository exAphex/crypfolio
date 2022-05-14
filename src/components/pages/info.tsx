import React, {Component} from 'react';
const {ipcRenderer} = window.require('electron');

type InfoOverviewState = {version: string};

export class InfoOverview extends Component<{}, InfoOverviewState> {
  state: InfoOverviewState = {
    version: '',
  };

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('query-version');
  }

  componentDidMount() {
    ipcRenderer.on('query-version', (_event: any, arg: string) => {
      this.setState({version: arg});
    });

    ipcRenderer.send('get-version', '');
  }

  render() {
    return (
      <div className="h-full flex justify-center items-center flex-col">
        <div className="text-4xl font-bold">Crypfolio</div>
        <div className="">Version: {this.state.version}</div>
        <div className="">by exAphex</div>
      </div>
    );
  }
}

export default InfoOverview;
