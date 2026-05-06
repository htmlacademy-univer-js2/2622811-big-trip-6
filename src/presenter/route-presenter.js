import EventsView from '../view/events-view';
import SortView from '../view/sort-view';
import EmptyMessageView from '../view/empty-message-view';
import {render, RenderPosition, remove} from '../framework/render';
import {EventPresenter} from './event-presenter';
import {NewEventPresenter} from './new-event-presenter';
import {FilterType, SortType, UserAction} from '../types';

const sortEventsByDay = (eventA, eventB) =>
  new Date(eventA.start).getTime() - new Date(eventB.start).getTime();

const sortEventsByTime = (eventA, eventB) =>
  (new Date(eventB.end).getTime() - new Date(eventB.start).getTime()) -
  (new Date(eventA.end).getTime() - new Date(eventA.start).getTime());

const sortEventsByPrice = (eventA, eventB) => eventB.price - eventA.price;

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => new Date(event.start) > new Date()),
  [FilterType.PRESENT]: (events) => events.filter((event) => new Date(event.start) <= new Date() && new Date(event.end) >= new Date()),
  [FilterType.PAST]: (events) => events.filter((event) => new Date(event.end) < new Date()),
};

export class RoutePresenter {
  #eventsModel;
  #offersModel;
  #destinationsModel;
  #filterModel;
  #currentSortType = SortType.DAY;
  #eventPresenters = {};
  #eventsView = new EventsView();
  #sortView = null;
  #emptyMessageView = null;
  #newEventPresenter = null;

  constructor({eventsModel, offersModel, destinationsModel, filterModel}) {
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleFilterChange);
  }

  init() {
    render(this.#eventsView, document.querySelector('.trip-events'));

    if (this.#getFilteredEvents().length === 0) {
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
        onDataChange: this.#handleUserAction,
        onModeChange: this.#handleModeChange,
      });

      presenter.init(this.#eventsView, event);
      this.#eventPresenters[event.id] = presenter;
    }
  }

  #renderEmptyMessage() {
    this.#emptyMessageView = new EmptyMessageView(this.#filterModel.getFilter());
    render(this.#emptyMessageView, document.querySelector('.trip-events'));
  }

  #clearEventsList() {
    for (const key in this.#eventPresenters) {
      this.#eventPresenters[key].destroy();
    }

    this.#eventPresenters = {};
    remove(this.#emptyMessageView);
    this.#emptyMessageView = null;
  }

  #getSortedEvents() {
    const events = [...this.#getFilteredEvents()];

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

  #getFilteredEvents() {
    const filterType = this.#filterModel.getFilter();
    const events = this.#eventsModel.getEvents();

    return filter[filterType](events);
  }

  #renderRoute() {
    this.#clearEventsList();
    remove(this.#sortView);
    this.#sortView = null;

    if (this.#getFilteredEvents().length === 0) {
      this.#renderEmptyMessage();
      return;
    }

    this.#renderSort();
    this.#renderEvents();
  }

  createEvent() {
    if (this.#newEventPresenter !== null) {
      return;
    }

    this.#currentSortType = SortType.DAY;
    this.#handleModeChange();
    this.#filterModel.setFilter(FilterType.EVERYTHING);
    remove(this.#emptyMessageView);
    this.#emptyMessageView = null;

    this.#newEventPresenter = new NewEventPresenter({
      eventsContainer: this.#eventsView.element,
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      onDataChange: this.#handleUserAction,
      onDestroy: this.#handleNewEventDestroy,
    });

    this.#newEventPresenter.init();
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

  #handleFilterChange = () => {
    this.#currentSortType = SortType.DAY;
    this.#renderRoute();
  };

  #handleUserAction = (actionType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(update);
        break;
      case UserAction.ADD_EVENT:
        this.#destroyNewEvent();
        this.#eventsModel.updateEvent(update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(update.id);
        break;
    }

    this.#renderRoute();
  };

  #handleModeChange = () => {
    this.#destroyNewEvent();
    Object.values(this.#eventPresenters).forEach((presenter) =>
      presenter.resetView(),
    );
  };

  #destroyNewEvent() {
    this.#newEventPresenter?.destroy();
    this.#newEventPresenter = null;
  }

  #handleNewEventDestroy = () => {
    this.#newEventPresenter = null;

    if (this.#eventsModel.getEvents().length === 0) {
      this.#renderRoute();
    }
  };
}
