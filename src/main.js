import FilterView from './view/filter';
import {render, RenderPosition} from './render';
import InfoView from './view/info';
import SortView from './view/sort';
import EventView from './view/event';
import EventsView from './view/events';
import EditEventView from './view/edit-event';

class PagePresenter {
  init() {
    this.#renderInfo();
    this.#renderFilter();
    this.#renderSort();

    const eventsView = new EventsView();
    this.#renderEvents(eventsView);
    this.#renderEventForms(eventsView);
  }

  #renderInfo() {
    const infoView = new InfoView(
      'Amsterdam &mdash; Chamonix &mdash; Geneva',
      '18&nbsp;&mdash;&nbsp;20 Mar',
      1230
    );

    render(infoView, document.querySelector('.trip-main'), RenderPosition.AFTERBEGIN);
  }

  #renderFilter() {
    const filterView = new FilterView([
      { id: 'everything', name: 'Everything' },
      { id: 'future', name: 'Future' },
      { id: 'present', name: 'Present' },
      { id: 'past', name: 'Past' },
    ], 'everything');

    render(filterView, document.querySelector('.trip-controls__filters'));
  }

  #renderSort() {
    const sortView = new SortView([
      { id: 'day', name: 'Day' },
      { id: 'event', name: 'Event', disabled: true },
      { id: 'time', name: 'Time' },
      { id: 'price', name: 'Price' },
      { id: 'offers', name: 'Offers', disabled: true },
    ], 'day');

    render(sortView, document.querySelector('.trip-events'));
  }

  #renderEvents(eventsView) {
    for (let i = 0; i < 3; i++) {
      const eventView = new EventView({
        date: new Date('2019-03-18'),
        eventType: 'taxi',
        title: 'Taxi Amsterdam',
        start: new Date('2019-03-18T10:30'),
        end: new Date('2019-03-18T11:00'),
        price: 1230,
        offers: [
          { title: 'Order Uber', price: 20 }
        ],
        isFavourite: false,
      });
      render(eventView, eventsView.getElement());
    }
  }

  #renderEventForms(eventsView) {
    const editEventView = new EditEventView();
    render(editEventView, eventsView.getElement(), RenderPosition.AFTERBEGIN);

    const newEventView = new EditEventView(true);
    render(newEventView, eventsView.getElement());

    render(eventsView, document.querySelector('.trip-events'));
  }
}

const presenter = new PagePresenter();
presenter.init();
