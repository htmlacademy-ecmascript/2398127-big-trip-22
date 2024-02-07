import { POINT_COUNT } from '../const.js';
import { destinationsMock } from '../mock/destinations.js';
import { offersMock } from '../mock/offers.js';
import { getRandomPoint } from '../mock/points.js';

export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #offers = offersMock;
  #destinations = destinationsMock;

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  getOfferByType(type) {
    return this.#offers.find((offers) => offers.type === type);
  }

  getOfferById(type, offerId) {
    const availableOffers = this.getOfferByType(type);
    const filteredOffers = availableOffers.offers.filter((offers) => offerId.find((id) => offers.id === id));
    return filteredOffers;
  }

  getDestinationById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }
}
