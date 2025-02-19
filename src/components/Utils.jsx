import taskCompleted from '../assets/icons/GreenTickTranspa.png';
import progressIcon from '../assets/icons/progress.png';
import bellIcon from '../assets/icons/Bell_Orange32.gif';
import calendarIcon from '../assets/icons/Calendar32.png';
import { showErrorSnackbar } from '../Redux/Actions/snackbar';
import { show } from '../Redux/Actions/loader';

const getInitials = (name) => {
  let initials;
  const nameSplit = name?.split(' ');
  const nameLength = nameSplit.length;
  if (nameLength > 1) {
    initials = nameSplit[0].substring(0, 1) + nameSplit[nameLength - 1].substring(0, 1);
  } else if (nameLength === 1) {
    initials = nameSplit[0].substring(0, 1);
  } else return;

  return initials?.toUpperCase();
};

export const createImageFromInitials = (size, name, color) => {
  if (name == null) return;
  const initials = getInitials(name);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = canvas.height = size;

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, size, size);

  context.fillStyle = `${color}50`;
  context.fillRect(0, 0, size, size);

  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.font = `${size / 2}px Poppins`;
  context.fillText(initials, size / 2, size / 2);

  return canvas.toDataURL();
};

function nth(d) {
  const dString = String(d);
  const last = +dString.slice(-2);
  if (last > 3 && last < 21) return d + 'th';
  switch (last % 10) {
    case 1:
      return d + 'st';
    case 2:
      return d + 'nd';
    case 3:
      return d + 'rd';
    default:
      return d + 'th';
  }
}

export const dateFormat = (date, reverse) => {
  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const month = formattedDate.getMonth() + 1;
  const year = formattedDate.getFullYear().toString().substr(-2);
  let monthString = '';

  switch (month) {
    case 1:
      monthString = 'Jan';
      break;
    case 2:
      monthString = 'Feb';
      break;
    case 3:
      monthString = 'Mar';
      break;
    case 4:
      monthString = 'Apr';
      break;
    case 5:
      monthString = 'May';
      break;
    case 6:
      monthString = 'Jun';
      break;
    case 7:
      monthString = 'Jul';
      break;
    case 8:
      monthString = 'Aug';
      break;
    case 9:
      monthString = 'Sep';
      break;
    case 10:
      monthString = 'Oct';
      break;
    case 11:
      monthString = 'Nov';
      break;
    case 12:
      monthString = 'Dec';
      break;
  }
  if (reverse) {
    return formattedDate.getFullYear() + '-' + month + '-' + day;
  } else {
    return nth(day) + ' ' + monthString + ' ' + year;
  }
};

export function formatDateTime(date, format, utc) {
  var MMMM = [
    '\x00',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  var MMM = [
    '\x01',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var dddd = ['\x02', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var ddd = ['\x03', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function ii(i, len = 2) {
    let s = i + '';
    while (s.length < len) s = '0' + s;
    return s;
  }

  var y = utc ? date.getUTCFullYear() : date.getFullYear();
  format = format?.replace(/(^|[^\\])yyyy+/g, '$1' + y);
  format = format?.replace(/(^|[^\\])yy/g, '$1' + y.toString().substr(2, 2));
  format = format?.replace(/(^|[^\\])y/g, '$1' + y);

  var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
  format = format?.replace(/(^|[^\\])MMMM+/g, '$1' + MMMM[0]);
  format = format?.replace(/(^|[^\\])MMM/g, '$1' + MMM[0]);
  format = format?.replace(/(^|[^\\])MM/g, '$1' + ii(M));
  format = format?.replace(/(^|[^\\])M/g, '$1' + M);

  var d = utc ? date.getUTCDate() : date.getDate();
  format = format?.replace(/(^|[^\\])dddd+/g, '$1' + dddd[0]);
  format = format?.replace(/(^|[^\\])ddd/g, '$1' + ddd[0]);
  format = format?.replace(/(^|[^\\])dd/g, '$1' + ii(d));
  format = format?.replace(/(^|[^\\])d/g, '$1' + d);

  var H = utc ? date.getUTCHours() : date.getHours();
  format = format?.replace(/(^|[^\\])HH+/g, '$1' + ii(H));
  format = format?.replace(/(^|[^\\])H/g, '$1' + H);

  var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
  format = format?.replace(/(^|[^\\])hh+/g, '$1' + ii(h));
  format = format?.replace(/(^|[^\\])h/g, '$1' + h);

  var m = utc ? date.getUTCMinutes() : date.getMinutes();
  format = format?.replace(/(^|[^\\])mm+/g, '$1' + ii(m));
  format = format?.replace(/(^|[^\\])m/g, '$1' + m);

  var s = utc ? date.getUTCSeconds() : date.getSeconds();
  format = format?.replace(/(^|[^\\])ss+/g, '$1' + ii(s));
  format = format?.replace(/(^|[^\\])s/g, '$1' + s);

  var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
  format = format?.replace(/(^|[^\\])fff+/g, '$1' + ii(f, 3));
  f = Math.round(f / 10);
  format = format?.replace(/(^|[^\\])ff/g, '$1' + ii(f));
  f = Math.round(f / 10);
  format = format?.replace(/(^|[^\\])f/g, '$1' + f);

  var T = H < 12 ? 'AM' : 'PM';
  format = format?.replace(/(^|[^\\])TT+/g, '$1' + T);
  format = format?.replace(/(^|[^\\])T/g, '$1' + T.charAt(0));

  var t = T.toLowerCase();
  format = format?.replace(/(^|[^\\])tt+/g, '$1' + t);
  format = format?.replace(/(^|[^\\])t/g, '$1' + t.charAt(0));

  var tz = -date.getTimezoneOffset();
  var K = utc || !tz ? 'Z' : tz > 0 ? '+' : '-';
  if (!utc) {
    tz = Math.abs(tz);
    var tzHrs = Math.floor(tz / 60);
    var tzMin = tz % 60;
    K += ii(tzHrs) + ':' + ii(tzMin);
  }
  format = format?.replace(/(^|[^\\])K/g, '$1' + K);

  var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
  format = format?.replace(new RegExp(dddd[0], 'g'), dddd[day]);
  format = format?.replace(new RegExp(ddd[0], 'g'), ddd[day]);

  format = format?.replace(new RegExp(MMMM[0], 'g'), MMMM[M]);
  format = format?.replace(new RegExp(MMM[0], 'g'), MMM[M]);

  format = format?.replace(/\\(.)/g, '$1');

  return format;
}

export function timeAgo(prevDate) {
  const diff = Number(new Date()) - prevDate;
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;
  switch (true) {
    case diff < minute: {
      const seconds = Math.round(diff / 1000);
      return `${seconds} ${seconds > 1 ? 'secs' : 'sec'} ago`;
    }
    case diff < hour:
      return Math.round(diff / minute) + ' mins ago';
    case diff < day:
      return Math.round(diff / hour) + ' hrs ago';
    case diff < month:
      return Math.round(diff / day) === 1 ? 'yesterday' : Math.round(diff / day) + ' days ago';
    case diff < year:
      return Math.round(diff / month) > 1
        ? Math.round(diff / month) + ' months ago'
        : Math.round(diff / month) + ' month ago';
    case diff > year:
      return Math.round(diff / year) + ' years ago';
    default:
      return '';
  }
}

export function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

export function getDuration(date1, date2) {
  const ONE_DAY = 1000 * 3600 * 24;
  const differenceMs = new Date(date1).getTime() - new Date(date2).getTime();
  if (isNaN(parseFloat(differenceMs))) {
    return 0;
  }
  return Math.round(differenceMs / ONE_DAY);
}

export const colorsArray = [
  '#CD6155',
  // "#EC7063",
  '#AF7AC5',
  '#A569BD',
  '#377AA7',
  '#5499C7',
  '#5DADE2',
  '#48C9B0',
  '#45B39D',
  '#52BE80',
  // "#58D68D",
  '#F4D03F',
  '#F5B041',
  '#EB984E',
  '#DC7633',
  '#CACFD2',
  '#AAB7B8',
  '#99A3A4',
  '#5D6D7E',
  '#4D5B67',
];

export function extract_before_texts(texts, comment) {
  let splitted = texts?.split(comment);
  if (splitted == undefined) {
    return ' ';
  } else {
    return splitted[0]?.substr(splitted[0]?.length - 300);
  }
}

export function extract_after_texts(texts, comment) {
  try {
    let splitted = texts?.split(comment);
    if (splitted == undefined) {
      return ' ';
    } else {
      return splitted[1]?.substr(0, 300);
    }
  } catch (_error) {
    // TODO
  }
}

export function reverseArr(input) {
  var ret = new Array();
  for (var i = input.length - 1; i >= 0; i--) {
    ret.push(input[i]);
  }
  return ret;
}

export function replaceCumulative(str, find, replace) {
  for (var i = 0; i < find.length; i++) str = str.replace(new RegExp(find[i], 'g'), replace[i]);
  return str;
}

export function getDevice() {
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent,
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.substring(0, 4),
    )
  ) {
    return true;
  }
}

export function currencyFormatter(locale, value, currency) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency == undefined ? 'GBP' : currency,
      maximumSignificantDigits: 3,
    }).format(value);
  } catch (_error) {
    // TODO handle error
  }
}

export function getCurrencySymbol(currency_name) {
  let currency_symbols = {
    USD: '$', // US Dollar
    EUR: '€', // Euro
    CRC: '₡', // Costa Rican Colón
    GBP: '£', // British Pound Sterling
    ILS: '₪', // Israeli New Sheqel
    INR: '₹', // Indian Rupee
    JPY: '¥', // Japanese Yen
    KRW: '₩', // South Korean Won
    NGN: '₦', // Nigerian Naira
    PHP: '₱', // Philippine Peso
    PLN: 'zł', // Polish Zloty
    PYG: '₲', // Paraguayan Guarani
    THB: '฿', // Thai Baht
    UAH: '₴', // Ukrainian Hryvnia
    VND: '₫', // Vietnamese Dong
  };

  if (currency_symbols[currency_name] !== undefined) {
    return currency_symbols[currency_name];
  }
}

export function truncateString(string) {
  return string.substring(0, 47) + '...';
}

export function isActive(value) {
  const { pathname } = window.location;
  return pathname === value ? 'side-nav__link active' : '';
}

export function findPercentage(num1, num2) {
  if (num2 === 0) {
    return 0;
  }

  return Math.round((num1 / num2) * 100);
}

export function getFileFromBase64(string64, fileName) {
  const trimmedString = string64.replace('data:image/png;base64,', '');
  const imageContent = window.atob(trimmedString);
  const buffer = new ArrayBuffer(imageContent.length);
  const view = new Uint8Array(buffer);

  for (let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }
  const type = 'image/png';
  const blob = new Blob([buffer], { type });
  return new File([blob], fileName, {
    lastModified: new Date().getTime(),
    type,
  });
}

export function makePlurals(value, string) {
  return value > 1 ? value + ' ' + string + 's' : value + ' ' + string;
}

export function getQuarter(date, yearEndMonth = 12) {
  return Math.floor(((date.getMonth() - yearEndMonth + 12) % 12) / 3) + 1;
}

export function getQuarterStart(date, yearEndMonth = 12) {
  const _date = new Date(date.getTime());
  const quarterStartMonth = (getQuarter(_date, yearEndMonth) * 3 + yearEndMonth - 3) % 12;

  if (quarterStartMonth > date.getMonth() + 1) {
    _date.setFullYear(_date.getFullYear() - 1);
  }
  _date.setMonth(quarterStartMonth, 1);
  _date.setHours(0, 0, 0, 0);

  return _date;
}

export function getQuarterEnd(date, yearEndMonth = 12) {
  const _date = new Date(date.getTime());
  const quarterEndMonth = (getQuarter(_date, yearEndMonth) * 3 + yearEndMonth) % 12;

  if (quarterEndMonth === 0 || quarterEndMonth < date.getMonth() + 1) {
    _date.setFullYear(_date.getFullYear() + 1);
  }

  _date.setMonth(quarterEndMonth, 0);
  _date.setHours(23, 59, 59, 999);

  return _date;
}

export function getCurrentQuarter(yearEndMonth) {
  var today = new Date();

  return {
    year: today.getFullYear(),
    quarter: getQuarter(today, yearEndMonth),
    start_date: getQuarterStart(today, yearEndMonth),
    end_date: getQuarterEnd(today, yearEndMonth),
  };
}

export function getLastQuarter(date) {
  const quarterYear =
    new Date(date).getFullYear() < new Date().getFullYear()
      ? new Date(date).getFullYear()
      : new Date().getFullYear();
  const quarterStartMonth = new Date(date).getMonth() - 3;
  const quarterEndMonth = quarterStartMonth + 3;
  const quarter_start_date = new Date(quarterYear, quarterStartMonth, 1);
  const quarter_end_date = new Date(quarterYear, quarterEndMonth, 0);
  return {
    year: quarterYear,
    start_date: quarter_start_date,
    end_date: quarter_end_date,
  };
}

export function getNextQuarter(date) {
  const quarterYear =
    new Date(date).getFullYear() > new Date().getFullYear()
      ? new Date(date).getFullYear()
      : new Date().getFullYear();
  const quarterStartMonth = new Date(date).getMonth() + 1;
  const quarterEndMonth = quarterStartMonth + 3;
  const quarter_start_date = new Date(quarterYear, quarterStartMonth, 1);
  const quarter_end_date = new Date(quarterYear, quarterEndMonth, 0);
  return {
    year: quarterYear,
    start_date: quarter_start_date,
    end_date: quarter_end_date,
  };
}

export function getDateFormat(date) {
  let d = new Date(date);
  let format = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  return format;
}

export function nextQuarterCount(quarter) {
  return quarter + 1 > 4 ? 1 : quarter + 1;
}

export function lastQuarterCount(quarter) {
  return quarter - 1 === 0 ? 4 : quarter - 1;
}

export function getFilteredValues(arr, status, view, onlyFilter) {
  let filtered = arr?.filter((item) =>
    view === 'monthly_view'
      ? item.forecast_status_monthly === status
      : item.forecast_status === status,
  );
  let filteredVals = [];
  filtered?.forEach((element) => filteredVals.push(element.project_value));
  if (onlyFilter) {
    return filtered;
  } else {
    return {
      total: filteredVals?.reduce((a, b) => a + b, 0),
      length: filtered?.length,
    };
  }
}

export function createData(name, value, value1, value2, value3) {
  return {
    name,
    value,
    value1,
    value2,
    value3,
  };
}

export function createProjectData(
  id,
  name,
  value,
  owner,
  target_close_date,
  projected_end_date,
  duration,
  actual_close_date,
  forecast_status,
  total_cards,
  project_type,
  total_closed_cards,
  percentage_completed,
  created_at,
) {
  return [
    id,
    name,
    value,
    owner,
    target_close_date,
    projected_end_date,
    duration,
    actual_close_date,
    forecast_status,
    total_cards,
    project_type,
    total_closed_cards,
    percentage_completed,
    created_at,
  ];
}

export function createQueueData(
  board_name,
  title,
  custom_label,
  start_date,
  end_date,
  actual_completion_date,
  account_name,
  internal_assignee,
  external_assignee,
  duration,
  lapse_duration,
  side,
  status,
) {
  return [
    board_name,
    title,
    custom_label,
    start_date,
    end_date,
    actual_completion_date,
    account_name,
    internal_assignee,
    external_assignee,
    duration,
    lapse_duration,
    side,
    status,
  ];
}

export function getPlurals(value, string) {
  return value > 1 ? value + ' ' + string + 's' : value + ' ' + string;
}

export const getTaskStatus = (status, start_date, end_date) => {
  return status ? (
    <img
      src={taskCompleted}
      className="task-status-icon"
    />
  ) : start_date > new Date().toJSON().slice(0, 10).replace(/-/g, '-') ? (
    <img
      src={calendarIcon}
      className="task-status-icon"
    />
  ) : start_date <= new Date().toJSON().slice(0, 10).replace(/-/g, '-') &&
    new Date().toJSON().slice(0, 10).replace(/-/g, '-') <= end_date ? (
    <img
      src={progressIcon}
      className="task-status-icon"
    />
  ) : new Date().toJSON().slice(0, 10).replace(/-/g, '-') > end_date ? (
    <img
      src={bellIcon}
      className="task-status-icon"
    />
  ) : (
    ''
  );
};

export const showTaskStatus = (status, start_date, end_date) => {
  const today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');

  if (status) {
    return 'Completed';
  }

  if (start_date >= today) {
    return `Starting in ${getPlurals(getDuration(start_date, new Date()), 'Day')}`;
  }

  if (start_date <= today && today < end_date) {
    return `Due in ${getPlurals(getDuration(end_date, new Date()), 'Day')}`;
  }

  if (today > end_date) {
    return `${getPlurals(getDuration(new Date(), end_date), 'Day')} overdue`;
  }

  return '';
};

export const getBoardStatus = (status, date) => {
  if (status) {
    return { text: 'Completed', color: '#33e0b3', background: '#ebf8f2' };
  }

  const today = new Date().toJSON().slice(0, 10).replace(/-/g, '-');

  if (today >= date) {
    return { text: 'Ongoing', color: '#E4A11B', background: '#f9ecd1' };
  }

  if (today < date) {
    return {
      text: 'Scheduled',
      color: '#627daf',
      background: 'rgba(98,125,175,0.2)',
    };
  }

  return '';
};

export function handleError(error, dispatch) {
  dispatch(show(false));
  const internalErr = 'Error: Request failed with status code 500';
  const badReq = 'Error: Request failed with status code 400';
  const largeFileErr = 'Error: 413 Request Entity Too Large';
  const permissionErr = 'Error: Request failed with status code 403';
  const ntwrkErr = 'Error: Network Error';
  if ('details' in (error?.response?.data || {})) {
    dispatch(showErrorSnackbar(error?.response?.data?.details));
  } else if (error.toString() == internalErr) {
    dispatch(showErrorSnackbar('Internal Server Error occurred!'));
    return;
  } else if (error.toString() == badReq) {
    dispatch(showErrorSnackbar('Bad Request!'));
    return;
  } else if (error.toString() == ntwrkErr) {
    dispatch(showErrorSnackbar('Network Error!'));
    return;
  } else if (error.toString() == largeFileErr) {
    dispatch(showErrorSnackbar('Maximum file Size allowed is 10Mb'));
    return;
  } else if (error.toString() == permissionErr) {
    dispatch(showErrorSnackbar(error?.response?.data?.details));
    return;
  }
}

export function handleErrorOnLitePages(error, dispatch) {
  dispatch(show(false));
  const internalErr = 'Error: Request failed with status code 500';
  const badReq = 'Error: Request failed with status code 400';
  const ntwrkErr = 'Error: Network Error';
  if ('details' in (error?.response?.data || {})) {
    dispatch(showErrorSnackbar(error?.response?.data?.details));
    return;
  } else if (error.toString() == internalErr) {
    dispatch(showErrorSnackbar('Internal Server Error occurred!'));
    return;
  } else if (error.toString() == badReq) {
    dispatch(showErrorSnackbar('Bad Request!'));
    return;
  } else if (error.toString() == ntwrkErr) {
    dispatch(showErrorSnackbar('Network Error!'));
    return;
  } else {
    return;
  }
}

export function getStatusColor(done, total) {
  const ratio = done / total;
  if (ratio < 0.3) {
    return 'error';
  } else if (ratio < 0.7) {
    return 'warning';
  } else if (total === 0) {
    return 'nothing';
  } else {
    return 'success';
  }
}

export function getForecastStatus(status) {
  let strStatus = status?.toLowerCase();
  if (strStatus === 'on track') {
    return '#91cf51';
  } else if (strStatus === 'upside') {
    return '#ffbf00';
  } else if (strStatus === 'slipping') {
    return '#ec7d31';
  } else if (strStatus === 'closed') {
    return '#37b7db';
  }
}

export function getForecastInfo(status, dates) {
  let strStatus = status?.toLowerCase();
  if (strStatus === 'on track') {
    return `This project is on track because the estimated completion date is <u><strong>${dateFormat(
      new Date(dates.board_likely_end_date),
    )}</strong></u>. which is before the end of the target quarter on <u><strong>${dateFormat(
      new Date(dates.target_quarter_end_date),
    )}</strong></u>`;
  } else if (strStatus === 'upside') {
    return `This project is showing as potential upside because based on current trends, the estimated completion date is <u><strong>${dateFormat(
      new Date(dates.board_likely_end_date),
    )}</strong></u> which is after the end of the target quarter on <u><strong>${dateFormat(
      new Date(dates.target_quarter_end_date),
    )}</strong></u>, but if the remaining tasks were rushed, the project could be completed by <u><strong>${dateFormat(
      new Date(dates.likely_end_date_rush),
    )}</strong></u>, which is inside the quarter.`;
  } else if (strStatus === 'slipping') {
    return `This project is looking like it might be slipping because even if the remaining tasks were rushed, the estimated completion date is <u><strong>${dateFormat(
      new Date(dates.likely_end_date_rush),
    )}</strong></u> which is after the end of the target quarter on <u><strong>${dateFormat(
      new Date(dates.target_quarter_end_date),
    )}</strong></u>.`;
  }
}

export function compareArrays(a, b) {
  const aId = a[0].card_start_date;
  const bId = b[0].card_start_date;

  if (aId < bId) {
    return -1;
  } else if (aId > bId) {
    return 1;
  } else {
    return 0;
  }
}

export function saveDataToLocalStorage(data) {
  var a = [];
  a = JSON.parse(localStorage.getItem('read_notifs')) || [];
  a.push(data);
  if (data.length > 0) {
    localStorage.setItem('read_notifs', JSON.stringify(data));
  } else {
    localStorage.setItem('read_notifs', JSON.stringify(a));
  }
}

export function mergeArraysById(arr1, arr2) {
  const mergedArray = [...arr1];
  const arr2Lookup = {};
  for (const obj of arr2) {
    arr2Lookup[obj?.object_id] = obj;
  }
  for (let i = 0; i < mergedArray?.length; i++) {
    const id = mergedArray[i].object_id;
    if (arr2Lookup[id]) {
      mergedArray[i] = { ...mergedArray[i], ...arr2Lookup[id] };
    }
  }
  return mergedArray;
}

export function updateElementInArray(arr, idToUpdate, updatedData) {
  return arr.map((item) => {
    if (item.object_id === idToUpdate) {
      return { ...item, ...updatedData };
    }
    return item;
  });
}

export function assignColorsToNames(names, colors) {
  const nameToColor = {};
  const nameToBackground = {};
  // Create a mapping of names to colors
  (names || [])?.forEach((name, index) => {
    if (!nameToColor[name]) {
      nameToColor[name.category] = colors[index % colors.length].color;
      nameToBackground[name.category] = colors[index % colors.length].background;
    }
  });

  // Add color information to the elements in the namesArray
  const elementsWithColors = (names || []).map((name) => ({
    id: name.id,
    category: name.category,
    label: name.label,
    color: nameToColor[name.category],
    background: nameToBackground[name.category],
  }));

  return elementsWithColors;
}

export const capitalizeWords = (mySentence) => {
  const words = mySentence?.split(' ');
  for (let i = 0; i < words?.length; i++) {
    words[i] = words[i][0]?.toUpperCase() + words[i]?.substr(1);
  }
  return words?.join(' ');
};

export function isAlphanumeric(input) {
  // Define a regular expression pattern to match only lowercase and uppercase letters.
  const pattern = /^[a-zA-Z]+$/;
  // Test the input against the pattern and return true if it matches, false otherwise.
  return pattern.test(input);
}

export const removeDuplicates = (array) => {
  const obj = array.reduce((acc, cur) => {
    acc[cur] = { index: cur };
    return acc;
  }, {});

  const output = Object.values(obj)
    .sort((a, b) => a.index - b.index)
    .map(({ index: val }) => val);
  return output;
};

export function getMonthDates(offset) {
  const today = new Date();
  today.setMonth(today.getMonth() + offset);

  const year =
    today.getMonth() === 0 && offset === -1
      ? today.getFullYear() - 1
      : today.getMonth() === 11 && offset === 1
        ? today.getFullYear() + 1
        : today.getFullYear();
  const month = today.getMonth();

  const start_date = new Date(year, month, 1);
  const end_date = new Date(year, month + 1, 0);

  return { start_date, end_date };
}

export function getMonthString(monthNumber) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (monthNumber >= 1 && monthNumber <= 12) {
    return months[monthNumber - 1];
  } else {
    return 'Invalid Month Number';
  }
}

export function addOneDay(date = new Date()) {
  date.setDate(date.getDate() + 1);
  return new Date(date)?.toJSON()?.slice(0, 10).replace(/-/g, '-');
}

export const get_meddpicc_status = (score) => {
  return score == 0
    ? 'btn-gray'
    : score == 1
      ? 'btn-red'
      : score == 2
        ? 'btn-orange'
        : score == 3
          ? 'btn-green'
          : 'btn-gray';
};

export const convertLinks = (input) => {
  let text = input;
  const linksFound = text.match(/(?:www|https?)[^\s]+/g);
  const aLink = [];

  if (linksFound != null) {
    for (let i = 0; i < linksFound.length; i++) {
      let replace = linksFound[i];
      if (!linksFound[i].match(/(http(s?)):\/\//)) {
        replace = 'http://' + linksFound[i];
      }
      let linkText = replace.split('/')[2];
      if (linkText.substring(0, 3) == 'www') {
        linkText = linkText.replace('www.', '');
      }
      if (linkText.match(/youtu/)) {
        let youtubeID = replace.split('/').slice(-1)[0];
        aLink.push(
          '<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/' +
            youtubeID +
            '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>',
        );
      } else if (linkText.match(/vimeo/)) {
        let vimeoID = replace.split('/').slice(-1)[0];
        aLink.push(
          '<div class="video-wrapper"><iframe src="https://player.vimeo.com/video/' +
            vimeoID +
            '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>',
        );
      } else {
        aLink.push(
          '<a class="hyperlink" href="' + replace + '" target="_blank">' + linkText + '</a>',
        );
      }
      text = text
        .split(linksFound[i])
        .map((item) => {
          return aLink[i].includes('iframe') ? item.trim() : item;
        })
        .join(aLink[i]);
    }
    return text;
  } else {
    return input;
  }
};

export function setURLParameter(url, paramName, paramValue) {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);

  params.set(paramName, paramValue);

  urlObj.search = params.toString();
  window.open(urlObj.toString(), '_self');
  return urlObj.toString();
}

export function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
