import TripInfoView from './view/trip-info-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render, RenderPosition } from './framework/render.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button-view.js';

const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({container: tripEvents, pointsModel, filterModel, onNewPointDestroy: handleNewEventFormClose});
const filterPresenter = new FilterPresenter({filterContainer: tripFilters, filterModel, pointsModel});

render(new TripInfoView(), tripMain, RenderPosition.AFTERBEGIN);
const newEventButtonComponent = new NewEventButtonView({onClick: handleNewEventButtonClick});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  boardPresenter.createPoint();
  newEventButtonComponent.element.disabled = true;
}
render(newEventButtonComponent, tripMain, RenderPosition.BEFOREEND);
boardPresenter.init();
filterPresenter.init();
