import {
  add,
  endOfWeek,
  format,
  min,
  startOfWeek,
  isValid,
  max,
  getMonth,
  getDaysInMonth,
  startOfMonth,
  getYear,
  startOfYear,
} from "date-fns";

export const calculateBeginDate = (list) => {
  if (!list?.length) return new Date();
  const minDate = min(list);
  return isValid(minDate) ? minDate : new Date();
};

export const calculateFinishDate = (list) => {
  if (!list?.length) return new Date();
  const maxDate = max(list);
  return isValid(maxDate) ? maxDate : new Date();
};

export const calculateEndDate = (list) => {
  if (!list?.length) return new Date();
  const datesList = list.map((el) => new Date(el.end_time));
  const maxDate = max(datesList);
  return isValid(maxDate) ? maxDate : new Date();
};

// ! CALCULATE INDEXED DATES IN WEEK
export const calculateIndexedDates = (date) => {
  const result = [];

  for (let i = 0; i < 105; i++) {
    result.push(...getIndexedDatesInWeek(add(date, { weeks: i })));
  }
  return result;
};

// ! GET INDEXED DATES IN WEEK
const getIndexedDatesInWeek = function (date) {
  const startDate = startOfWeek(date, { weekStartsOn: 1 });

  const dates = [];

  for (let i = 0; i < 7; i++) {
    dates.push(format(add(startDate, { days: i }), "MM-dd-yyyy"));
  }

  return dates;
};
// ! CALCULATE INDEXED DATES IN MONTH
export const calculateIndexedDatesInMonth = (date) => {
  const result = [];

  for (let i = 0; i < 36; i++) {
    result.push(...getIndexedDatesInMonth(add(date, { months: i })));
  }
  return result;
};

// ! GET INDEXED DATES IN MONTH
const getIndexedDatesInMonth = function (date) {
  const startDate = startOfMonth(date);

  const dates = [];

  for (let i = 0; i < getDaysInMonth(date); i++) {
    dates.push(format(add(startDate, { days: i }), "MM-dd-yyyy"));
  }

  return dates;
};
// ! CALCULATE INDEXED DATES IN YEAR
export const calculateIndexedDatesInYear = (date) => {
  const result = [];

  for (let i = 0; i < 3; i++) {
    result.push(...getIndexedDatesInYear(add(date, { years: i })));
  }
  return result;
};

// ! GET INDEXED DATES IN YEAR
const getIndexedDatesInYear = function (date) {
  const startDate = startOfYear(date);

  const dates = [];

  for (let i = 0; i < 12; i++) {
    dates.push(format(add(startDate, { months: i }), "MM-yyyy"));
  }

  return dates;
};
// ! CALCULATEGANTTCALENDAR
export const calculateGanttCalendar = (date) => {
  const result = [];

  for (let i = 0; i < 105; i++) {
    result.push(getDatesInWeekWithTitle(add(date, { weeks: i })));
  }
  return result;
};
// ! CALCULATEGANTTCALENDAR IN MONTH
export const calculateGanttCalendarInMonth = (date) => {
  const result = [];

  for (let i = 0; i < 36; i++) {
    result.push(getDatesInMonthWithTitle(add(date, { months: i })));
  }
  return result;
};
// ! CALCULATEGANTTCALENDAR IN YEAR
export const calculateGanttCalendarInYear = (date) => {
  const result = [];

  for (let i = 0; i < 3; i++) {
    result.push(getDatesInYearWithTitle(add(date, { years: i })));
  }
  return result;
};

const getDatesInWeekWithTitle = function (date) {
  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  const endDate = endOfWeek(date);
  const title = `${format(startDate, "dd MMM")} - ${format(endDate, "dd MMM")}`;
  const dates = [];

  for (let i = 0; i < 7; i++) {
    dates.push(format(add(startDate, { days: i }), "dd"));
  }

  return {
    title,
    dates,
  };
};

const getDatesInMonthWithTitle = function (date) {
  const startDate = startOfMonth(date);
  const dates = [];
  const title = getMonth(date);

  for (let i = 0; i < getDaysInMonth(date); i++) {
    dates.push(format(add(startDate, { days: i }), "dd"));
  }

  return {
    title,
    dates,
  };
};

const getDatesInYearWithTitle = function (date) {
  const startDate = startOfYear(date);
  const dates = [];
  const title = getYear(date);

  for (let i = 0; i < 12; i++) {
    dates.push(format(add(startDate, { days: i }), "dd"));
  }

  return {
    title,
    dates,
  };
};
