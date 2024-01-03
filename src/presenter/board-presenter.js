import SortView from '../view/sort-view.js';
import EditListView from '../view/event-list-view.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class BoardPresener {
  sortComponent = new SortView();
  editListComponent = new EditListView();
  formEditComponent = new FormEditView();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(this.sortComponent, this.container);
    render(this.editListComponent, this.container);
    render(this.formEditComponent, this.editListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.editListComponent.getElement());
    }
  }
}
