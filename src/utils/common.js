import dayjs from 'dayjs';
import { DATE_FORMAT, SHORT_DATE_FORMAT, TIME_FORMAT } from '../const.js';

function getRandomArrayElement(item) {
  return item[Math.floor(Math.random() * item.length)];
}

const humanizePointsDate = (date) => dayjs(date).format(DATE_FORMAT);
const humanizeShortDate = (date) => dayjs(date).format(SHORT_DATE_FORMAT).toUpperCase();
const humanizeTime = (date) => dayjs(date).format(TIME_FORMAT);
const isFuture = (point) => dayjs().isBefore(point.startDate);
const isPresent = (point) => dayjs().isAfter(point.startDate) && dayjs().isBefore(point.endDate);
const isPast = (point) => dayjs().isAfter(point.endDate);

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {updateItem, isFuture, isPresent, isPast, getRandomArrayElement, humanizePointsDate, humanizeShortDate, humanizeTime };

