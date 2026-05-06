import InfoView from '../view/info-view';
import {render, RenderPosition} from '../framework/render';
import {RoutePresenter} from './route-presenter';

export class PagePresenter {
  #eventsModel;
  #routePresenter;

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

}
