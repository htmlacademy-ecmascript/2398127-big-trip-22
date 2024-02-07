import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
  ERROR: 'Failed to load latest route information'
};

const createNoPointsTemplate = (filterType, isError = false) => {
  const NoPointsTextValue = isError ? NoPointsTextType.ERROR : NoPointsTextType[filterType];
  return `<p class="trip-events__msg">${NoPointsTextValue}</p>`;
};

export default class NoPointView extends AbstractView {
  #filterType = null;
  #isError = false;

  constructor({filterType, isError = false}) {
    super();
    this.#filterType = filterType;
    this.#isError = isError;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType, this.#isError);
  }
}
