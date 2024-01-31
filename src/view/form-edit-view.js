import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizePointsDate } from '../utils/common.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import { CITY_NAMES, EVENT_TYPES } from '../const.js';
const createCitiesTemplate = () => CITY_NAMES.map((city) => `<option value="${city}"></option>`).join('');

const createTypeTemplate = (checkedType) => EVENT_TYPES.map((type, id) => {
  const isChecked = type === checkedType;
  return (
    `
    <div class="event__type-item">
    <input id="event-type-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${id}">${capitalizeFirstLetter(type)}</label>
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

const createFormEditTemplate = (point, destinations, offers, checkedOffers) => {
  const { startDate, endDate, type, price, id} = point;
  const destination = destinations.find((destinationFromList) => destinationFromList.id === point.destination);
  const {pictures, description, name} = destination;
  const offersByType = offers.find((offer) => offer.type === point.type);
  const isOffersExist = offersByType && offersByType.offers.length > 0;
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
                    <label class="event__label  event__type-output" for="event-destination-${destination.id}">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${destination.id}" type="text" name="event-destination" value="${name}" list="destination-list-${destination.id}">
                    <datalist id="destination-list-${destination.id}">
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
                    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${price}">
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
                    <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${pictures.map(({ description: descriptionPicture, src }) => `<img class="event__photo" src="${src}" alt="${descriptionPicture}">`).join('')}
                      </div>
                  </div>
                  </section>
                </section>
      </form>
    </li>
    `
  );
};

export default class EditFormView extends AbstractStatefulView {
  #availableOffers = null;
  #checkedOffers = null;
  #handleFormSubmit = null;
  #handleEditClick = null;
  #availableDestinations = null;
  #pointsModel = null;

  constructor({point, availableOffers, checkedOffers, onFormSubmit, onClickEdit, availableDestinations, pointsModel}) {
    super();
    this._setState(EditFormView.parsePointToState(point));
    this.#availableDestinations = availableDestinations;
    this.#availableOffers = availableOffers;
    this.#pointsModel = pointsModel;
    this.#checkedOffers = checkedOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onClickEdit;
    this._restoreHandlers();
  }

  get template() {
    return createFormEditTemplate(this._state, this.#availableDestinations, this.#availableOffers, this.#checkedOffers);
  }

  reset(point) {
    this.updateElement(
      EditFormView.parsePointToState(point)
    );
  }

  removeElement() {
    super.removeElement();
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.FormEditView.parseStateToPoint(this._state));
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.tagName === 'INPUT') {
      const selectedDestination = this.#availableDestinations.find((newDestination) => newDestination.name === evt.target.value);
      this.updateElement({
        ...this._state,
        destination: selectedDestination.id,
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      price: evt.target.value
    });
  };

  #eventChangeHandler = (evt) => {
    evt.preventDefault();
    const newEvent = evt.target.value;
    const newEventOffers = this.#pointsModel.getOfferByType(newEvent).offers || [];
    this.updateElement({
      ...this._state,
      type: newEvent,
      offers: newEventOffers
    });
  };

  #offerChangeHandler = () => {
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({...this._state.point, offers: checkedOffers.map((offer) => offer.dataset.offerId)});
  };

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    const point = {...state};
    return point;
  }
}
