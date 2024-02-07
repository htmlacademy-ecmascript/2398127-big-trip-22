import { render, RenderPosition, remove } from '../framework/render.js';
import { UserAction, UpdateType, NEW_POINT } from '../const.js';
import EditFormView from '../view/form-edit-view.js';
import { generateRandomId } from '../utils/common.js';
export default class FormAddPresenter {
  #pointsModel = null;
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #availableDestinations = null;
  #availableOffers = null;
  #editFormComponent = null;

  constructor({pointsModel, pointListContainer, onDataChange, onDestroy, availableDestinations, availableOffers }) {
    this.#pointsModel = pointsModel;
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#availableDestinations = availableDestinations;
    this.#availableOffers = availableOffers;
  }

  init(point = NEW_POINT) {
    if (this.#editFormComponent !== null) {
      return;
    }

    this.#editFormComponent = new EditFormView({
      point: point,
      pointsModel: this.#pointsModel,
      availableDestinations: this.#availableDestinations || [],
      availableOffers: this.#availableOffers || [],
      checkedOffers: [],
      onEditClick: this.#handleCloseClick,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      isNew: true
    });
    render(this.#editFormComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editFormComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editFormComponent);
    this.#editFormComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    const randomId = generateRandomId(1000, 10000);

    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,

      {...NEW_POINT, id: randomId, ...point},
    );
    this.destroy();
  };

  #handleCloseClick = () => {
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
