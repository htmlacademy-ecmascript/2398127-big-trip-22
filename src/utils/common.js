import dayjs from 'dayjs';
import { DATE_FORMAT, SHORT_DATE_FORMAT, TIME_FORMAT } from '../const.js';

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

export { capitalizeFirstLetter, sortByDay, sortByTime, sortByPrice, isFuture, isPresent, isPast, humanizePointsDate, humanizeShortDate, humanizeTime, isDatesEqual };

