import { getRandomArrayElement } from '../utils/common.js';
const pointsMock = [
  {
    id: '1',
    type: 'taxi',
    destination: '1',
    startDate: new Date('2025-08-11T10:00'),
    endDate: new Date('2025-09-15T16:30'),
    price: 1550,
    offers: ['101', '102'],
    isFavourite: true,
  },
  {
    id: '2',
    type: 'bus',
    destination: '2',
    startDate: new Date('2025-08-12T12:00'),
    endDate: new Date('2025-08-15T14:00'),
    price: 2200,
    offers: ['103'],
    isFavourite: false,
  },
  {
    id: '3',
    type: 'train',
    destination: '3',
    startDate: new Date('2022-08-23T17:00'),
    endDate: new Date('2022-08-29T18:00'),
    price: 3300,
    offers: [],
    isFavourite: false,
  }
];

const getRandomPoint = () => getRandomArrayElement(pointsMock);

export { getRandomPoint, pointsMock };
