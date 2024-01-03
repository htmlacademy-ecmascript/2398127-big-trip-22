import { getRandomArrayElement } from '../utils.js';
const pointsMock = [
  {
    id: 1,
    typeOfPoint: 'taxi',
    destinations: '1',
    startDate: new Date('2023-08-11T10:00'),
    endDate: new Date('2023-09-15T16:30'),
    price: 1550,
    offers: [
      '101', '102'
    ],
    isFavourite: true,
  },
  {
    id: 2,
    typeOfPoint: 'bus',
    destinations: '2',
    startDate: new Date('2023-08-12T12:00'),
    endDate: new Date('2023-08-15T14:00'),
    price: 2200,
    offers: [
      '103'
    ],
    isFavourite: false,
  },
  {
    id: 3,
    typeOfPoint: 'train',
    destinations: '3',
    startDate: new Date('2023-08-23T17:00'),
    endDate: new Date('2023-08-28T18:00'),
    price: 3300,
    offers: [],
    isFavourite: false,
  }
];

function getRandomPoint() {
  return getRandomArrayElement(pointsMock);
}

export { getRandomPoint };
