import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #apiService = null;
  #isLoaded = false;
  #isFailed = false;

  constructor({apiService}) {
    super();
    this.#apiService = apiService;
    apiService.getDestinations().then((destinations) => {
      this.setDestinations(destinations);
    }).catch(() => {
      this.#isFailed = true;
      this.setDestinations([]);
    });
  }

  get isLoaded() {
    return this.#isLoaded;
  }

  get isFailed() {
    return this.#isFailed;
  }

  getDestinations() {
    return this.#destinations;
  }

  setDestinations(destinations) {
    this.#destinations = destinations;
    this.#isLoaded = true;
    this._notify();
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
