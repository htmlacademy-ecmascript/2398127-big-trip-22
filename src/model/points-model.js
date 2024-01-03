import { POINT_COUNT } from '../const.js';
import { destinationsMock } from '../mock/destinations.js';
import { offersMock } from '../mock/offers.js';
import { getRandomPoint } from '../mock/points.js';

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, getRandomPoint);
  offers = offersMock;
  destinations = destinationsMock;

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }

  getOfferByType(type) {
    return this.getOffers().find((offers) => offers.type === type);
  }

  getDestinationById(id) {
    return this.getDestinations().find((destination) => destination.id === id);
  }
}
