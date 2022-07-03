import React, {Component} from 'react';

type ExportTaxReportPropertiesProps = {
  onGenerateTaxReport: (year: number) => void;
  onCloseModal: () => void;
};

type ExportTaxReportPropertiesState = {
  year: number;
};

type YearItem = {
  text: string;
  value: number;
};

export class ExportTaxReportProperties extends Component<
  ExportTaxReportPropertiesProps,
  ExportTaxReportPropertiesState
> {
  state: ExportTaxReportPropertiesState = {
    year: new Date().getFullYear(),
  };

  getExportYears(): YearItem[] {
    const retYears = [];
    const currYear = new Date().getFullYear();
    for (let i = 2011; i < currYear; i++) {
      retYears.push({text: i + '', value: i});
    }
    return retYears;
  }

  handleChangeYear(evt: React.ChangeEvent<HTMLSelectElement>) {
    const types = this.getExportYears();
    for (const t of types) {
      if (t.text === evt.target.value) {
        this.setState({year: t.value});
        break;
      }
    }
  }

  render() {
    return (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="w-full relative w-auto my-6 mx-auto max-w-sm">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
              <div className="bg-white">
                <div className="sm:flex sm:items-start"></div>
                <div className="mb-1 w-full flex-col mt-3">
                  <label className="font-medium text-gray-800 py-2">Year</label>
                  <div className="relative ">
                    <svg
                      className="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 412 232"
                    >
                      <path
                        d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z"
                        fill="#648299"
                        fillRule="nonzero"
                      />
                    </svg>
                    <select
                      onChange={(evt) => this.handleChangeYear(evt)}
                      className="px-4 h-10 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded border border-grey-lighter w-full"
                    >
                      {this.getExportYears()
                        .sort((l, u) => {
                          return l.value > u.value ? 1 : -1;
                        })
                        .map((item) => (
                          <option key={item.value}>{item.text}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    this.props.onGenerateTaxReport(0);
                  }}
                  className={
                    'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ' +
                    'bg-green-600 hover:bg-green-700 focus:ring-green-500' +
                    ' text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm'
                  }
                >
                  Export tax report
                </button>
                <button
                  type="button"
                  onClick={() => this.props.onCloseModal()}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
    );
  }
}

export default ExportTaxReportProperties;
