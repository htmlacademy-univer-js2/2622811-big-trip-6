import EventsView from '../view/events-view';
import InfoView from '../view/info-view';
import {render, RenderPosition} from '../render';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';

export class PagePresenter {
  #eventsModel;
  #events;

  constructor({eventsModel}) {
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.getEvents()];
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
    const filterView = new FilterView('everything');

    render(filterView, document.querySelector('.trip-controls__filters'));
  }

  #renderSort() {
    const sortView = new SortView('day');

    render(sortView, document.querySelector('.trip-events'));
  }

  #renderEvents(eventsView) {
    for (const event of this.#events) {
      const eventView = new EventView(
        event,
        event.offers.map((id) => this.#eventsModel.getOfferById(id)),
        this.#eventsModel.getDestinationById(event.destination)
      );
      render(eventView, eventsView.getElement());
    }
  }

  #renderEventForms(eventsView) {
    const event = this.#events[0];
    const editEventView = new EditEventView(
      this.#eventsModel.getOffersByType(event.type),
      this.#eventsModel.getDestinationById(event.destination),
      event
    );
    render(editEventView, eventsView.getElement(), RenderPosition.AFTERBEGIN);

    const newEventView = new EditEventView(
      this.#eventsModel.getOffersByType('taxi'),
      this.#eventsModel.getDestinations()[0]
    );
    render(newEventView, eventsView.getElement());

    render(eventsView, document.querySelector('.trip-events'));
  }
}
