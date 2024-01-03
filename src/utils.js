import dayjs from 'dayjs';
import { DATE_FORMAT, SHORT_DATE_FORMAT, TIME_FORMAT } from './const';

function getRandomArrayElement(item) {
  return item[Math.floor(Math.random() * item.length)];
}

const humanizePointsDate = (date) => dayjs(date).format(DATE_FORMAT);
const humanizeShortDate = (date) => dayjs(date).format(SHORT_DATE_FORMAT).toUpperCase();
const humanizeTime = (date) => dayjs(date).format(TIME_FORMAT);
export { getRandomArrayElement, humanizePointsDate, humanizeShortDate, humanizeTime };

