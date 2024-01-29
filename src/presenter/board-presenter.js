import SortView from '../view/sort-view.js';
import EditListView from '../view/list-edit-view.js';
import EditFormView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import NoPointView from '../view/no-point-view.js';
import {render, replace, RenderPosition} from '../framework/render.js';

export default class BoardPresenter {
  #container;
  #pointsModel;

  #sortComponent = new SortView();
  #editListComponent = new EditListView();
  #noPointComponent = new NoPointView();
  #boardPoints = [];

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];
    this.#renderBoard();
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const pointComponent = new PointView({
      point: point,
      destination: this.#pointsModel.getDestinationById(point.destination),
      offers: [...this.#pointsModel.getOfferById(point.type, point.offers)],
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const formEditComponent = new EditFormView({
      point: point,
      destination: this.#pointsModel.getDestinationById(point.destination),
      checkedOffers: [...this.#pointsModel.getOfferById(point.type, point.offers)],
      offers: this.#pointsModel.getOfferByType(point.type),
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onClickEdit: () => {
        replaceFormToPoint();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(formEditComponent, pointComponent);
    }
    function replaceFormToPoint() {
      replace(pointComponent, formEditComponent);
    }
    render(pointComponent, this.#editListComponent.element);
  }

  #renderSort() {
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderListEdit() {
    render(this.#editListComponent, this.#container);
  }

  #renderPoints() {
    this.#boardPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#container);
  }

  #renderBoard() {
    if (this.#boardPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderListEdit();
    this.#renderPoints();
  }
}
