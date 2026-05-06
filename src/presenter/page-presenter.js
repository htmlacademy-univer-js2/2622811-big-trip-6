import dayjs from 'dayjs';
import InfoView from '../view/info-view';
import {render, RenderPosition, remove} from '../framework/render';
import {RoutePresenter} from './route-presenter';

export class PagePresenter {
  #eventsModel;
  #offersModel;
  #destinationsModel;
  #routePresenter;
  #infoView = null;
  #newEventButton = document.querySelector('.trip-main__event-add-btn');

  constructor({ eventsModel, offersModel, destinationsModel, filterModel }) {
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#routePresenter = new RoutePresenter({
      eventsModel,
      offersModel,
      destinationsModel,
      filterModel,
      onNewEventOpen: this.#handleNewEventOpen,
      onNewEventClose: this.#handleNewEventClose,
    });

    this.#eventsModel.addObserver(this.#handleModelChange);
    this.#offersModel.addObserver(this.#handleModelChange);
    this.#destinationsModel.addObserver(this.#handleModelChange);
  }

  init() {
    if (this.#shouldRenderInfo()) {
      this.#renderInfo();
    }

    this.#newEventButton.addEventListener('click', this.#handleNewEventButtonClick);
    this.#routePresenter.init();
  }

  #renderInfo() {
    const events = this.#getSortedEvents();

    remove(this.#infoView);
    this.#infoView = new InfoView(
      this.#formatTripTitle(events),
      this.#formatTripDates(events),
      this.#calculateTripCost(events),
    );

    render(
      this.#infoView,
      document.querySelector('.trip-main'),
      RenderPosition.AFTERBEGIN,
    );
  }

  #getSortedEvents() {
    return [...this.#eventsModel.getEvents()].sort((eventA, eventB) =>
      new Date(eventA.start).getTime() - new Date(eventB.start).getTime()
    );
  }

  #formatTripTitle(events) {
    const destinationNames = events
      .map((event) => this.#destinationsModel.getById(event.destination)?.name)
      .filter(Boolean);

    if (destinationNames.length > 3) {
      return `${destinationNames[0]} &mdash; ... &mdash; ${destinationNames[destinationNames.length - 1]}`;
    }

    return destinationNames.join(' &mdash; ');
  }

  #formatTripDates(events) {
    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];
    const start = dayjs(firstEvent.start);
    const end = dayjs(lastEvent.end);

    return `${start.format('D MMM')}&nbsp;&mdash;&nbsp;${end.format('D MMM')}`;
  }

  #calculateTripCost(events) {
    return events.reduce((total, event) => {
      const offersCost = event.offers.reduce((offersTotal, offerId) => {
        const offer = this.#offersModel.getById(offerId);

        return offersTotal + (offer?.price ?? 0);
      }, 0);

      return total + event.price + offersCost;
    }, 0);
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

  #shouldRenderInfo() {
    return this.#isDataLoaded() &&
      !this.#hasLoadingError() &&
      this.#eventsModel.getEvents().length > 0;
  }

  #handleModelChange = () => {
    if (this.#shouldRenderInfo()) {
      this.#renderInfo();
      return;
    }

    remove(this.#infoView);
    this.#infoView = null;
  };

  #handleNewEventButtonClick = () => {
    this.#routePresenter.createEvent();
  };

  #handleNewEventOpen = () => {
    this.#newEventButton.disabled = true;
  };

  #handleNewEventClose = () => {
    this.#newEventButton.disabled = false;
  };
}
