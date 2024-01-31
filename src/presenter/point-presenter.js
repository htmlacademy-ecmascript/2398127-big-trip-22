import PointView from '../view/point-view.js';
import EditFormView from '../view/form-edit-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../const.js';
export default class PointPresenter {
  #container = null;
  #pointsModel = null;
  #point = null;
  #pointComponent = null;
  #formEditComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ container, pointsModel, onDataChange, onModeChange }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#formEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#pointsModel.getDestinationById(this.#point.destination),
      offers: [...this.#pointsModel.getOfferById(this.#point.type, this.#point.offers)],
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#formEditComponent = new EditFormView({
      point: this.#point,
      availableDestinations: this.#pointsModel.destinations,
      checkedOffers: [...this.#pointsModel.getOfferById(this.#point.type, this.#point.offers)],
      availableOffers: this.#pointsModel.offers,
      onFormSubmit: this.#handleFormSubmit,
      onClickEdit: this.#handleFormClose,
      pointsModel: this.#pointsModel
    });

    if(prevPointComponent === null || prevFormEditComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#formEditComponent, prevFormEditComponent);
    }
    remove(prevPointComponent);
    remove(prevFormEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#formEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToForm() {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#formEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => {
    this.#formEditComponent.reset(this.#point);
    this.#replacePointToForm();
  };

  #handleFormClose = () => {
    this.#formEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceFormToPoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
