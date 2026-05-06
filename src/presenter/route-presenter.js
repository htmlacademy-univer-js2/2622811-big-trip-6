import EventsView from '../view/events-view';
import SortView from '../view/sort-view';
import EmptyMessageView from '../view/empty-message-view';
import LoadingMessageView from '../view/loading-message-view';
import FailedLoadMessageView from '../view/failed-load-message-view';
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
  #loadingMessageView = null;
  #failedLoadMessageView = null;
  #newEventPresenter = null;
  #isEventsViewRendered = false;

  constructor({eventsModel, offersModel, destinationsModel, filterModel}) {
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleFilterChange);
    this.#eventsModel.addObserver(this.#handleModelChange);
    this.#offersModel.addObserver(this.#handleModelChange);
    this.#destinationsModel.addObserver(this.#handleModelChange);
  }

  init() {
    if (this.#hasLoadingError()) {
      this.#renderFailedLoadMessage();
      return;
    }

    if (!this.#isDataLoaded()) {
      this.#renderLoadingMessage();
      return;
    }

    this.#renderEventsView();

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

  #renderLoadingMessage() {
    if (this.#loadingMessageView !== null) {
      return;
    }

    this.#loadingMessageView = new LoadingMessageView();
    render(this.#loadingMessageView, document.querySelector('.trip-events'));
  }

  #renderFailedLoadMessage() {
    if (this.#failedLoadMessageView !== null) {
      return;
    }

    this.#failedLoadMessageView = new FailedLoadMessageView();
    render(this.#failedLoadMessageView, document.querySelector('.trip-events'));
  }

  #renderEventsView() {
    if (this.#isEventsViewRendered) {
      return;
    }

    render(this.#eventsView, document.querySelector('.trip-events'));
    this.#isEventsViewRendered = true;
  }

  #clearEventsList() {
    for (const key in this.#eventPresenters) {
      this.#eventPresenters[key].destroy();
    }

    this.#eventPresenters = {};
    remove(this.#emptyMessageView);
    this.#emptyMessageView = null;
  }

  #clearMessages() {
    remove(this.#loadingMessageView);
    remove(this.#failedLoadMessageView);
    this.#loadingMessageView = null;
    this.#failedLoadMessageView = null;
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

  #isDataLoaded() {
    return this.#eventsModel.isLoaded &&
      this.#offersModel.isLoaded &&
      this.#destinationsModel.isLoaded;
  }

  #hasLoadingError() {
    return this.#eventsModel.isFailed ||
      this.#offersModel.isFailed ||
      this.#destinationsModel.isFailed;
  }

  #renderRoute() {
    this.#clearEventsList();
    remove(this.#sortView);
    this.#sortView = null;

    if (this.#hasLoadingError()) {
      this.#clearMessages();
      this.#renderFailedLoadMessage();
      return;
    }

    if (!this.#isDataLoaded()) {
      return;
    }

    this.#clearMessages();
    this.#renderEventsView();

    if (this.#getFilteredEvents().length === 0) {
      this.#renderEmptyMessage();
      return;
    }

    this.#renderSort();
    this.#renderEvents();
  }

  createEvent() {
    if (this.#newEventPresenter !== null || !this.#isDataLoaded() || this.#hasLoadingError()) {
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

  #handleModelChange = () => {
    this.#renderRoute();
  };

  #handleUserAction = async (actionType, update) => {
    try {
      switch (actionType) {
        case UserAction.UPDATE_EVENT:
          await this.#eventsModel.updateEvent(update);
          break;
        case UserAction.ADD_EVENT:
          await this.#eventsModel.addEvent(update);
          this.#destroyNewEvent();
          break;
        case UserAction.DELETE_EVENT:
          await this.#eventsModel.deleteEvent(update.id);
          break;
      }
    } catch {
      // ignore
    }
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
