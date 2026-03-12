import {createDestination} from '../mock/event-mock';

export class DestinationsModel {
  #destinations = [];

  constructor(destinationIds = []) {
    this.#destinations = destinationIds.map(createDestination);
  }

  getDestinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
