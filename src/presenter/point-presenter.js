import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const.js';
import { isDatesEqual } from '../utils/common.js';
export default class PointPresenter {
  #container = null;
  #pointsModel = null;
  #point = null;
  #pointComponent = null;
  #editFormComponent = null;
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
    const prevEditFormComponent = this.#editFormComponent;
    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#pointsModel.getDestinationById(this.#point.destination),
      offers: [...this.#pointsModel.getOfferById(this.#point.type, this.#point.offers)],
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editFormComponent = new EditFormView({
      point: this.#point,
      availableDestinations: this.#pointsModel.destinations,
      checkedOffers: [...this.#pointsModel.getOfferById(this.#point.type, this.#point.offers)],
      availableOffers: this.#pointsModel.offers,
      onFormSubmit: this.#handleFormSubmit,
      onEditClick: this.#handleFormClose,
      onDeleteClick: this.#handleDeleteClick,
      pointsModel: this.#pointsModel
    });

    if(prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }
    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevEditFormComponent);
      this.#mode = Mode.DEFAULT;
    }
    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editFormComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setFavoring() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.updateElement({
        isDisabled: true,
      });
    }
  }

  setAborting() {
    const resetPointState = () => {
      this.#pointComponent.updateElement({
        isDisabled: false
      });
    };
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake(resetPointState);
      return;
    }
    const resetFormState = () => {
      this.#editFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this.#editFormComponent.shake(resetFormState);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editFormComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormClose = () => {
    this.#editFormComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = (
      !isDatesEqual(this.#point.startDate, update.startDate) ||
      !isDatesEqual(this.#point.endDate, update.endDate) ||
      this.#point.price !== update.price
    );
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update
    );
  };

  #handleFavoriteClick = () => {
    this.setFavoring();
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #handleDeleteClick = (update) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      update
    );
  };
}
