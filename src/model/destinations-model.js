import {DESTINATIONS} from '../mock/event-mock';

export class DestinationsModel {
  #destinations = [];

  constructor() {
    this.#destinations = DESTINATIONS;
  }

  getDestinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
