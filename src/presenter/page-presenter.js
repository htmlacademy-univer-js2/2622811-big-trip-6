import InfoView from '../view/info-view';
import {render, RenderPosition} from '../framework/render';
import {RoutePresenter} from './route-presenter';

export class PagePresenter {
  #eventsModel;
  #routePresenter;
  #newEventButton = document.querySelector('.trip-main__event-add-btn');

  constructor({ eventsModel, offersModel, destinationsModel, filterModel }) {
    this.#eventsModel = eventsModel;
    this.#routePresenter = new RoutePresenter({
      eventsModel,
      offersModel,
      destinationsModel,
      filterModel,
    });
  }

  init() {
    if (this.#eventsModel.getEvents().length > 0) {
      this.#renderInfo();
    }

    this.#newEventButton.addEventListener('click', this.#handleNewEventButtonClick);
    this.#routePresenter.init();
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

  #handleNewEventButtonClick = () => {
    this.#routePresenter.createEvent();
  };
}
