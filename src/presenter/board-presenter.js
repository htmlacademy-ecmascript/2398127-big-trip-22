import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import NoPointView from '../view/no-point-view.js';
import {render, RenderPosition} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../const.js';
import {sortByDay, sortByPrice, sortByTime} from '../utils/common.js';
export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #sortComponent = null;
  #tripEventsListComponent = new TripEventsListView();
  #noPointComponent = new NoPointView();
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortByDay);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByTime);
    }
    return this.#pointsModel.points;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  init() {
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#tripEventsListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints(this.points);
  };

  #renderSort() {
    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderTripEventsList() {
    render(this.#tripEventsListComponent, this.#container);
  }

  #renderPoints(points) {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#container);
  }

  #renderBoard() {
    if (this.points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderTripEventsList();
    this.#renderPoints(this.points);
  }
}
