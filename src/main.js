import TripInfoView from './view/trip-info-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render, RenderPosition } from './framework/render.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button-view.js';
import PointsApiService from './points-api-service.js';

const AUTORIZATION = 'Basic j9fwj40br4up2dfz';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel({pointsApiService: new PointsApiService(END_POINT, AUTORIZATION)});
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

boardPresenter.init();
filterPresenter.init();
pointsModel.init().finally(() => {
  render(newEventButtonComponent, tripMain, RenderPosition.BEFOREEND);
});
