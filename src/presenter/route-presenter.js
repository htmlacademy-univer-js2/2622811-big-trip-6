import EventsView from '../view/events-view';
import SortView from '../view/sort-view';
import EmptyMessageView from '../view/empty-message-view';
import {render, RenderPosition, remove} from '../framework/render';
import {EventPresenter} from './event-presenter';

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const sortEventsByDay = (eventA, eventB) =>
  new Date(eventA.start).getTime() - new Date(eventB.start).getTime();

const sortEventsByTime = (eventA, eventB) =>
  (new Date(eventB.end).getTime() - new Date(eventB.start).getTime()) -
  (new Date(eventA.end).getTime() - new Date(eventA.start).getTime());

const sortEventsByPrice = (eventA, eventB) => eventB.price - eventA.price;

export class RoutePresenter {
  #eventsModel;
  #offersModel;
  #destinationsModel;
  #currentSortType = SortType.DAY;
  #eventPresenters = {};
  #eventsView = new EventsView();
  #sortView = null;

  constructor({eventsModel, offersModel, destinationsModel}) {
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    render(this.#eventsView, document.querySelector('.trip-events'));

    if (this.#eventsModel.getEvents().length === 0) {
      this.#renderEmptyMessage();
      return;
    }

    this.#renderSort();
    this.#renderEvents();
  }

  #renderSort() {
    this.#sortView = new SortView(this.#currentSortType, this.#handleSortTypeChange);

    render(
      this.#sortView,
      document.querySelector('.trip-events'),
      RenderPosition.AFTERBEGIN,
    );
  }

  #renderEvents() {
    const events = this.#getSortedEvents();

    for (const event of events) {
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

  #renderEmptyMessage() {
    const message = new EmptyMessageView();
    render(message, this.#eventsView.element);
  }

  #clearEventsList() {
    for (const key in this.#eventPresenters) {
      this.#eventPresenters[key].destroy();
    }

    this.#eventPresenters = {};
  }

  #getSortedEvents() {
    const events = [...this.#eventsModel.getEvents()];

    switch (this.#currentSortType) {
      case SortType.TIME:
        return events.sort(sortEventsByTime);
      case SortType.PRICE:
        return events.sort(sortEventsByPrice);
      case SortType.DAY:
      default:
        return events.sort(sortEventsByDay);
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventsList();
    remove(this.#sortView);
    this.#renderSort();
    this.#renderEvents();
  };

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
