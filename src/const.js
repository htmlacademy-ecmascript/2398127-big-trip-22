const POINT_COUNT = 4;
const DATE_FORMAT = 'DD/MM/YY HH:mm';
const SHORT_DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const CITY_NAMES = ['Moscow', 'st.Petersburg', 'Rostov'];
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};
export { FilterType, CITY_NAMES, POINT_COUNT, DATE_FORMAT, SHORT_DATE_FORMAT, TIME_FORMAT};
