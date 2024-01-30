import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointsDate } from '../utils/common.js';
import { pointsMock } from '../mock/points.js';
import { CITY_NAMES } from '../const.js';
const createCitiesTemplate = () => CITY_NAMES.map((city) => `<option value="${city}"></option>`).join('');

const createTypeTemplate = (type) => pointsMock.map((point) => {
  const pointChecked = type === point.type;
  return (
    `
    <div class="event__type-item">
    <input id="event-type-${point.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${point.type}" ${pointChecked ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${point.type}" for="event-type-${point.id}">${point.type}</label>
    </div>
    `
  );
}).join('');

const createOffersTemplate = (offersByType, checkedOffers) =>
  offersByType.map((offer) => {
    const checkedOffersId = checkedOffers.map((checkedOffer) => checkedOffer.id);
    const isChecked = checkedOffersId.includes(offer.id);
    return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${isChecked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
    `;
  }).join('');

const createFormEditTemplate = (point, destination, offersByType, checkedOffers) => {
  const { startDate, endDate, type, price, id} = point;
  const { name, description } = destination;
  const isOffersExist = offersByType && offersByType.offers && offersByType.offers.length > 0;
  const offersTemplate = isOffersExist ? createOffersTemplate(offersByType.offers, checkedOffers) : '';
  return (
    `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createTypeTemplate(type)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${id}">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${name}" list="destination-list-${id}">
                    <datalist id="destination-list-${id}">
                      ${createCitiesTemplate()}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${id}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${humanizePointsDate(startDate)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${humanizePointsDate(endDate)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${id}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${price}" type="text" name="event-price" value="${id}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${isOffersExist ? `
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">${offersTemplate}</div>
                  </section>
                  ` : ''}

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                  </section>
                </section>
      </form>
    </li>
    `
  );
};

export default class EditFormView extends AbstractView {
  #point;
  #destination;
  #offers;
  #checkedOffers;
  #handleFormSubmit;
  #handleEditClick;

  constructor({point, destination, offers, checkedOffers, onFormSubmit, onClickEdit}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#checkedOffers = checkedOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onClickEdit;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createFormEditTemplate(this.#point, this.#destination, this.#offers, this.#checkedOffers);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
