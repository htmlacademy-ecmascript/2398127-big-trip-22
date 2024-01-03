import InfoView from './view/info-view.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { render, RenderPosition } from './render.js';

const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');
const boardPresenter = new BoardPresenter({container: tripEvents});

render(new InfoView(), tripMain, RenderPosition.AFTERBEGIN);
render(new FilterView(), tripFilters);
boardPresenter.init();
