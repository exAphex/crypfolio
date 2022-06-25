import moment from 'moment';

export function getFormattedDate(date: Date): string {
  let retStr = '';
  if (date) {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    const hour =
      date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours();
    const minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes();
    const seconds =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : '' + date.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    retStr =
      [year, month, day].join('-') + ' ' + [hour, minutes, seconds].join(':');
  }

  return retStr;
}

export function getDateFromString(date: string): Date {
  return moment(date).toDate();
}
