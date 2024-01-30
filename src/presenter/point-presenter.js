import PointView from '../view/point-view.js';
import EditFormView from '../view/form-edit-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class PointPresenter {
  #container;
  #pointsModel;
  #point;
  #pointComponent;
  #formEditComponent;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#formEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#pointsModel.getDestinationById(this.#point.destination),
      offers: [...this.#pointsModel.getOfferById(this.#point.type, this.#point.offers)],
      onEditClick: this.#handleEditClick
    });

    this.#formEditComponent = new EditFormView({
      point: this.#point,
      destination: this.#pointsModel.getDestinationById(this.#point.destination),
      checkedOffers: [...this.#pointsModel.getOfferById(this.#point.type, this.#point.offers)],
      offers: this.#pointsModel.getOfferByType(this.#point.type),
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: this.#handleFormSubmit,
    });

    if(prevPointComponent === null || prevFormEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }
    if (this.#container.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#container.contains(prevFormEditComponent.element)) {
      replace(this.#formEditComponent, prevFormEditComponent);
    }
    remove(prevPointComponent);
    remove(prevFormEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replacePointToForm() {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };
}
