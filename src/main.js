import PagePresenter from './presenter/page-presenter';
import EventsModel from './model/events-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import EventsApiService from './events-api-service.js';

if (localStorage.getItem('token') === null) {
  localStorage.setItem('token', Math.random().toString(36).substring(2));
}

const ENDPOINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = `Basic ${localStorage.getItem('token')}`;

const apiService = new EventsApiService(ENDPOINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel({apiService});
const offersModel = new OffersModel({apiService});
const eventsModel = new EventsModel({apiService});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  eventsModel,
  filterModel,
  filterContainer: document.querySelector('.trip-controls__filters'),
});

const presenter = new PagePresenter({
  eventsModel,
  destinationsModel,
  offersModel,
  filterModel,
});

filterPresenter.init();
presenter.init();
