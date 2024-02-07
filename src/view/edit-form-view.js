import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import { EVENT_TYPES } from '../const.js';
import he from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createCitiesTemplate = (destinations) => destinations.map(({name}) => `<option value="${name}"></option>`).join('');

const createTypeTemplate = (checkedType, isDisabled) => EVENT_TYPES.map((type) => {
  const isChecked = type === checkedType;
  return `
    <div class="event__type-item">
    <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__type-label  event__type-label--${type}" for="event-type-${type}">${capitalizeFirstLetter(type)}</label>
    </div>
    `;
}).join('');

const createOffersTemplate = (offersByType, checkedOffers, isDisabled) =>
  offersByType.map((offer) => {
    const checkedOffersId = checkedOffers.map((checkedOffer) => checkedOffer.id);
    const isChecked = checkedOffersId.includes(offer.id);
    return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${isChecked ? 'checked' : ''} data-offer-id="${offer.id}" ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
    `;
  }).join('');

const createEditFormTemplate = (point, destinations, offers, checkedOffers, isNew = false, isSaving, isDeleting, isDisabled) => {
  const { type, price, id} = point;
  const destination = destinations.find((destinationFromList) => destinationFromList.id === point.destination) || {name: '', description: '', pictures: []};
  const {pictures, description, name} = destination;
  const offersByType = offers.find((offer) => offer.type === point.type) || { offers: [] };
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
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

                    <div class="event__type-list">
                      <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
                        <legend class="visually-hidden">Event type</legend>
                        ${createTypeTemplate(type)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-${destination.id}">
                      ${capitalizeFirstLetter(type)}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-${destination.id}" type="text" name="event-destination" value="${he.encode(name)}" list="destination-list-${destination.id}"  required ${isDisabled ? 'disabled' : ''}>
                    <datalist id="destination-list-${destination.id}">
                      ${createCitiesTemplate(destinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-${id}">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="" required ${isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="" required>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-${id}">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-${id}" type="number" min="1" name="event-price" value="${he.encode(String(price))}" required ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                  ${isNew ? '<button class="event__reset-btn" type="reset">Cancel</button>' : `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>`}
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${isOffersExist ? `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">${offersTemplate}</div>
                  </section>
                  ` : ''}

                  ${name && description ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${description}</p>
                    ${pictures.length !== 0 ? `<div class="event__photos-container">
                    <div class="event__photos-tape">
                    ${pictures.map(({ description: descriptionPicture, src }) => `<img class="event__photo" src="${src}" alt="${descriptionPicture}">`).join('')}
                    </div></div>` : ''}
                  </section>
                  ` : ''}
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
  #handleDeleteClick = null;
  #availableDestinations = null;
  #pointsModel = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({point, availableOffers, checkedOffers, onFormSubmit, onEditClick, availableDestinations, pointsModel, onDeleteClick, isNew}) {
    super();
    this._setState(EditFormView.parsePointToState(point));
    this.#availableDestinations = availableDestinations;
    this.#availableOffers = availableOffers;
    this.#pointsModel = pointsModel;
    this.#checkedOffers = checkedOffers;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;
    this.#handleDeleteClick = onDeleteClick;
    this.isNew = isNew;
    this._restoreHandlers();
  }

  get template() {
    const { isSaving, isDeleting, isDisabled } = this._state;
    return createEditFormTemplate(this._state, this.#availableDestinations, this.#availableOffers, this.#checkedOffers, this.isNew, isSaving, isDeleting, isDisabled);
  }

  reset(point) {
    this.updateElement(
      EditFormView.parsePointToState(point)
    );
  }

  removeElement() {
    super.removeElement();
    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event--edit')?.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceChangeHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    this.#setDatepickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    if(evt.target.tagName === 'INPUT') {
      const newDestination = this.#availableDestinations.find((selectedDestination) => selectedDestination.name === evt.target.value);
      const newDestinationId = (newDestination) ? newDestination.id : this._state.destination;

      this.updateElement({
        destination: newDestinationId,
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
    const newEventOffers = this.#pointsModel.getOfferByType(newEvent)?.offers || [];
    this.updateElement({
      type: newEvent,
      offers: newEventOffers
    });
  };

  #offerChangeHandler = () => {
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({...this._state.point, offers: checkedOffers.map((offer) => offer.dataset.offerId)});
  };

  #startDateCloseHandler = ([userDate]) => {
    this.updateElement({ startDate: userDate });
  };

  #endDateCloseHandler = ([userDate]) => {
    this.updateElement({ endDate: userDate });
  };

  #setDatepickers() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.startDate,
        onClose: this.#startDateCloseHandler,
        maxDate: this._state.endDate
      }
    );

    this.#datepickerEnd = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.endDate,
        onClose: this.#endDateCloseHandler,
        minDate: this._state.startDate
      }
    );
  }

  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}
