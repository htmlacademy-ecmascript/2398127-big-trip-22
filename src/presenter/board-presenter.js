import SortView from '../view/sort-view.js';
import EditListView from '../view/event-list-view.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class BoardPresener {
  sortComponent = new SortView();
  editListComponent = new EditListView();
  formEditComponent = new FormEditView();

  constructor({ container, pointsModel }) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];
    render(this.sortComponent, this.container);
    render(this.editListComponent, this.container);
    render(this.formEditComponent, this.editListComponent.getElement());

    for (let i = 0; i < this.boardPoints.length; i++) {
      render(new PointView({
        point: this.boardPoints[i],
        destination: this.pointsModel.getDestinationById(this.boardPoints[i].destination)
      }), this.editListComponent.getElement());
    }
  }
}
