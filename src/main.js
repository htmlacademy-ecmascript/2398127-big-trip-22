import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render, RenderPosition } from './framework/render.js';
import PointsModel from './model/points-model.js';
import { generateFilter } from './mock/filters.js';
const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({container: tripEvents, pointsModel});

const filters = generateFilter(pointsModel.points);
render(new TripInfoView(), tripMain, RenderPosition.AFTERBEGIN);
render(new FilterView({filters}), tripFilters);
boardPresenter.init();
