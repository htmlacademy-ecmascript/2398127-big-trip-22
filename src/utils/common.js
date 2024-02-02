import dayjs from 'dayjs';
import { DATE_FORMAT, SHORT_DATE_FORMAT, TIME_FORMAT } from '../const.js';

const getRandomArrayElement = (item) => item[Math.floor(Math.random() * item.length)];
const humanizePointsDate = (date) => dayjs(date).format(DATE_FORMAT);
const humanizeShortDate = (date) => dayjs(date).format(SHORT_DATE_FORMAT).toUpperCase();
const humanizeTime = (date) => dayjs(date).format(TIME_FORMAT);
const isFuture = (point) => dayjs().isBefore(point.startDate);
const isPresent = (point) => dayjs().isAfter(point.startDate) && dayjs().isBefore(point.endDate);
const isPast = (point) => dayjs().isAfter(point.endDate);
const getPointDuration = (point) => dayjs(point.startDate).diff(dayjs(point.endDate));
const sortByDay = (pointA, pointB) => dayjs(pointA.startDate).diff(dayjs(pointB.startDate));
const sortByTime = (pointA, pointB) => getPointDuration(pointA) - getPointDuration(pointB);
const sortByPrice = (pointB, pointA) => pointA.price - pointB.price;
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
const generateRandomId = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export { capitalizeFirstLetter, sortByDay, sortByTime, sortByPrice, isFuture, isPresent, isPast, getRandomArrayElement, humanizePointsDate, humanizeShortDate, humanizeTime, isDatesEqual, generateRandomId };

