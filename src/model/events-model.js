import {createDestination, createOffers, createRandomEvent} from '../mock/event-mock';

export class EventsModel {
  #eventsById = {};
  #offersById = {};
  #offerIdsByType = {};
  #destinationsById = {};

  constructor() {
    ['taxi', 'flight', 'restaurant'].map(createRandomEvent).reduce((acc, event) => {
      acc[event.id] = event;
      return acc;
    }, this.#eventsById);

    for (const event of Object.values(this.#eventsById)) {
      const {offers, type} = createOffers(event.type, event.offers);

      if(this.#offerIdsByType[type] === undefined) {
        this.#offerIdsByType[type] = [];
      }

      this.#offerIdsByType[type].push(...offers.map((offer) => offer.id));

      offers.reduce((acc, offer) => {
        acc[offer.id] = offer;
        return acc;
      }, this.#offersById);

      this.#destinationsById[event.destination] = createDestination(event.destination);
    }
  }

  getEvents() {
    return Object.values(this.#eventsById);
  }

  getDestinations() {
    return Object.values(this.#destinationsById);
  }

  getOfferById(offerId) {
    return this.#offersById[offerId];
  }

  getDestinationById(id) {
    return this.#destinationsById[id];
  }

  getOffersByType(type) {
    return this.#offerIdsByType[type].map((id) => this.#offersById[id]);
  }
}
