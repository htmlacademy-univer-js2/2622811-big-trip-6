import Observable from '../framework/observable';

export default class OffersModel extends Observable {
  #apiService = null;
  #offersByType = {};
  #offersById = {};
  #isLoaded = false;
  #isFailed = false;

  constructor({apiService}) {
    super();
    this.#apiService = apiService;
    apiService.getOffers().then((offerTypes) => {
      this.setOffers(offerTypes);
    }).catch(() => {
      this.#isFailed = true;
      this.setOffers([]);
    });
  }

  getOffers() {
    return Object.values(this.#offersByType);
  }

  get isLoaded() {
    return this.#isLoaded;
  }

  get isFailed() {
    return this.#isFailed;
  }

  setOffers(offerTypes) {
    this.#offersByType = {};
    this.#offersById = {};

    for (const {type, offers} of offerTypes) {
      this.#offersByType[type] = offers;

      offers.reduce((acc, offer) => {
        acc[offer.id] = offer;
        return acc;
      }, this.#offersById);
    }

    this.#isLoaded = true;
    this._notify();
  }

  getById(id) {
    return this.#offersById[id];
  }

  getByType(type) {
    return this.#offersByType[type];
  }
}
