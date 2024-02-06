const DATE_FORMAT = 'DD[D] HH[H] mm[M]';
const SHORT_DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';
const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};
const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};
const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const NEW_POINT = {
  'type': 'flight',
  'destination': '',
  'startDate': null,
  'endDate': null,
  'price': 0,
  'offers': [],
  'isFavorite': false
};
export { TimeLimit, NEW_POINT, UserAction, UpdateType, SortType, Mode, FilterType, EVENT_TYPES, DATE_FORMAT, SHORT_DATE_FORMAT, TIME_FORMAT};
