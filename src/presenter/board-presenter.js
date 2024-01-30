import SortView from '../view/sort-view.js';
import EditListView from '../view/list-edit-view.js';
import NoPointView from '../view/no-point-view.js';
import {render, RenderPosition} from '../framework/render.js';
import PointPresenter from './point-presenter.js';

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
    const pointPresenter = new PointPresenter({container: this.#editListComponent.element, pointsModel: this.#pointsModel});
    pointPresenter.init(point);
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
