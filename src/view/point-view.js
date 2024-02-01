import AbstractView from '../framework/view/abstract-view.js';
import { humanizeTime, humanizeShortDate } from '../utils/common.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const createOffersTemplate = (offers) => offers.length > 0
  ? offers.map((offer) => `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`
  ).join('')
  : '';

const createPointTemplate = (point, destination, offers) => {
  const {startDate, endDate, type, price, isFavorite} = point;
  const {name} = destination;
  const offerTemplate = createOffersTemplate(offers);
  const tripDuration = dayjs.duration(dayjs(endDate).diff(dayjs(startDate)));
  const tripDurationFormat = `${tripDuration.days() > 0 ? `${tripDuration.days()}D ` : ''}${tripDuration.hours() > 0 ? `${tripDuration.hours()}H ` : ''}${tripDuration.minutes()}M`;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `
    <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeShortDate(startDate)}">${humanizeShortDate(endDate)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeTime(startDate)}">${humanizeTime(startDate)}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeTime(endDate)}">${humanizeTime(endDate)}</time>
        </p>
        <p class="event__duration">${tripDurationFormat}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offerTemplate}
      </ul>
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `
  );
};

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, destination, offers, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
