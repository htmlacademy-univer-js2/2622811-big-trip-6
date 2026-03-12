import EventsView from '../view/events-view';
import InfoView from '../view/info-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import {render, RenderPosition} from '../framework/render';
import {EventPresenter} from './event-presenter';

export class PagePresenter {
  #eventsModel;
  #offersModel;
  #destinationsModel;
  #events;

  constructor({eventsModel, offersModel, destinationsModel}) {
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
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
      const presenter = new EventPresenter(event, this.#offersModel, this.#destinationsModel);
      presenter.render(eventsView);
    }
  }

  #renderEventForms(eventsView) {
    // const newEventView = new EditEventView(
    //   this.#offersModel.getByType('taxi'),
    //   this.#destinationsModel.getDestinations()[0]
    // );
    // render(newEventView, eventsView.element);

    render(eventsView, document.querySelector('.trip-events'));
  }
}
