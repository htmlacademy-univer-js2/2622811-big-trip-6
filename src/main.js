import {PagePresenter} from './presenter/page-presenter';
import {EventsModel} from './model/events-model';
import {OffersModel} from './model/offers-model';
import {DestinationsModel} from './model/destinations-model';
import {createRandomEvent} from './mock/event-mock';

const events = ['taxi', 'flight', 'restaurant', 'taxi', 'flight'].map(createRandomEvent);
const destinationsModel = new DestinationsModel(events.map((e) => e.destination));
const offersModel = new OffersModel(events.map((e) => ({type: e.type, offerIds: e.offers})));
const eventsModel = new EventsModel(events);

const presenter = new PagePresenter({
  eventsModel,
  destinationsModel,
  offersModel,
});

presenter.init();
