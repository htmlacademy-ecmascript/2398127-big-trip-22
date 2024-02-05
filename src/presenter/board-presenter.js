import SortView from '../view/sort-view.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import NoPointView from '../view/no-point-view.js';
import {render, RenderPosition, remove} from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import FormAddPresenter from './form-add-presenter.js';
import {TimeLimit, SortType, UpdateType, UserAction, FilterType, NEW_POINT} from '../const.js';
import {sortByDay, sortByPrice, sortByTime} from '../utils/common.js';
import { filter } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
export default class BoardPresenter {
  #container = null;
  #pointsModel = null;
  #filterModel = null;
  #sortComponent = null;
  #tripEventsListComponent = new TripEventsListView();
  #loadingComponent = new LoadingView();
  #noPointComponent = null;
  #pointPresenters = new Map();
  #formAddPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ container, pointsModel, filterModel, onNewPointDestroy }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#formAddPresenter = new FormAddPresenter({
      pointListContainer: this.#tripEventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
      availableDestinations: this.#pointsModel.destinations,
      availableOffers: this.#pointsModel.offers,
      pointsModel: this.#pointsModel
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#formAddPresenter.init(NEW_POINT);
  }

  #handleModeChange = () => {
    this.#formAddPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#formAddPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#formAddPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#tripEventsListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard({resetRenderedPointCount: true});
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({currentSortType: this.#currentSortType, onSortTypeChange: this.#handleSortTypeChange});
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

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({filterType: this.#filterType});
    render(this.#noPointComponent, this.#container);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#formAddPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noPointComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
  }

  #renderBoard() {
    this.#renderTripEventsList();

    if(this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPoints(this.points);
  }
}
