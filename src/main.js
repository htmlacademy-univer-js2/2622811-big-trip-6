import {PagePresenter} from './presenter/page-presenter';
import {EventsModel} from './model/events-model';
import {OffersModel} from './model/offers-model';
import {DestinationsModel} from './model/destinations-model';
import {FilterModel} from './model/filter-model';
import {createRandomEvent} from './mock/event-mock';
import {EVENT_TYPES} from './types.js';
import {FilterPresenter} from './presenter/filter-presenter';

const events = EVENT_TYPES.map(createRandomEvent);
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel(events.map((e) => ({type: e.type, offerIds: e.offers})));
const eventsModel = new EventsModel(events);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
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
