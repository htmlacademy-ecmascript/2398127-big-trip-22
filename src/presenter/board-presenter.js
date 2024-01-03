import SortView from '../view/sort-view.js';
import EditListView from '../view/event-list-view.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  editListComponent = new EditListView();

  constructor({ container, pointsModel }) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];
    render(this.sortComponent, this.container);
    render(this.editListComponent, this.container);
    render(new FormEditView({
      point: this.boardPoints[0],
      destination: this.pointsModel.getDestinationById(this.boardPoints[0].destination),
      checkedOffers: [...this.pointsModel.getOfferById(this.boardPoints[0].type, this.boardPoints[0].offers)],
      offers: this.pointsModel.getOfferByType(this.boardPoints[0].type),
    }), this.editListComponent.getElement());

    for (let i = 1; i < this.boardPoints.length; i++) {
      render(new PointView({
        point: this.boardPoints[i],
        destination: this.pointsModel.getDestinationById(this.boardPoints[i].destination),
        offers: [...this.pointsModel.getOfferById(this.boardPoints[i].type, this.boardPoints[i].offers)]
      }), this.editListComponent.getElement());
    }
  }
}
