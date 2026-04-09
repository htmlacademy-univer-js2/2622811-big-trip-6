import EventsView from '../view/events-view';
import InfoView from '../view/info-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import {render, RenderPosition} from '../framework/render';
import {EventPresenter} from './event-presenter';
import EmptyMessageView from '../view/empty-message-view';

export class PagePresenter {
  #eventsModel;
  #offersModel;
  #destinationsModel;
  #events;
  #eventPresenters = {};
  #eventsView = null;

  constructor({ eventsModel, offersModel, destinationsModel }) {
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#eventsView = new EventsView();

    this.#events = [...this.#eventsModel.getEvents()];
    if (this.#events.length > 0) {
      this.#renderInfo();
      this.#renderSort();
    } else {
      const message = new EmptyMessageView();
      render(message, this.#eventsView.element);
    }

    this.#renderFilter();
    this.#renderEvents();
    this.#renderEventForms();
  }

  #renderInfo() {
    const infoView = new InfoView(
      'Amsterdam &mdash; Chamonix &mdash; Geneva',
      '18&nbsp;&mdash;&nbsp;20 Mar',
      1230,
    );

    render(
      infoView,
      document.querySelector('.trip-main'),
      RenderPosition.AFTERBEGIN,
    );
  }

  #renderFilter() {
    const filterView = new FilterView('everything');

    render(filterView, document.querySelector('.trip-controls__filters'));
  }

  #renderSort() {
    const sortView = new SortView('day');

    render(sortView, document.querySelector('.trip-events'));
  }

  #renderEvents() {
    for (const event of this.#events) {
      const presenter = new EventPresenter({
        offersModel: this.#offersModel,
        destinationsModel: this.#destinationsModel,
        onDataChange: this.#handleEventChange,
        onModeChange: this.#handleModeChange,
      });

      presenter.init(this.#eventsView, event);
      this.#eventPresenters[event.id] = presenter;
    }
  }

  #renderEventForms() {
    render(this.#eventsView, document.querySelector('.trip-events'));
  }

  #handleEventChange = (updatedEvent) => {
    this.#eventsModel.updateEvent(updatedEvent);

    const presenter = this.#eventPresenters[updatedEvent.id];
    presenter?.init(this.#eventsView, updatedEvent);
  };

  #handleModeChange = () => {
    Object.values(this.#eventPresenters).forEach((presenter) =>
      presenter.resetView(),
    );
  };
}
