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
    isFavorite: true,
  },
  {
    id: '2',
    type: 'bus',
    destination: '2',
    startDate: new Date('2025-10-12T12:00'),
    endDate: new Date('2025-10-15T14:00'),
    price: 2200,
    offers: ['103'],
    isFavorite: false,
  },
  {
    id: '3',
    type: 'train',
    destination: '3',
    startDate: new Date('2023-05-23T17:00'),
    endDate: new Date('2023-08-29T18:00'),
    price: 3300,
    offers: ['101'],
    isFavorite: false,
  },
  {
    id: '4',
    type: 'train',
    destination: '4',
    startDate: new Date('2022-08-23T17:00'),
    endDate: new Date('2022-08-29T18:00'),
    price: 5000,
    offers: ['102'],
    isFavorite: false,
  },
  {
    id: '5',
    type: 'taxi',
    destination: '4',
    startDate: new Date('2022-08-23T17:00'),
    endDate: new Date('2022-08-29T18:00'),
    price: 6000,
    offers: ['101'],
    isFavorite: false,
  }
];

const getRandomPoint = () => getRandomArrayElement(pointsMock);

export { getRandomPoint, pointsMock };
