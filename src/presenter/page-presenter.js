import InfoView from '../view/info-view';
import {render, RenderPosition} from '../framework/render';
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
    if (this.#infoView !== null) {
      return;
    }

    this.#infoView = new InfoView(
      'Amsterdam &mdash; Chamonix &mdash; Geneva',
      '18&nbsp;&mdash;&nbsp;20 Mar',
      1230,
    );

    render(
      this.#infoView,
      document.querySelector('.trip-main'),
      RenderPosition.AFTERBEGIN,
    );
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
    }
  };

  #handleNewEventButtonClick = () => {
    this.#routePresenter.createEvent();
  };
}
