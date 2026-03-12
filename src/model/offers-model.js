import {createOffers} from '../mock/event-mock';

export class OffersModel {
  #offersByType = {};
  #offersById = {};

  constructor(eventTypesWithOfferIds = []) {
    for (const {type, offerIds} of eventTypesWithOfferIds) {
      const {offers} = createOffers(type, offerIds);

      this.#offersByType[type] = offers;

      offers.reduce((acc, offer) => {
        acc[offer.id] = offer;
        return acc;
      }, this.#offersById);
    }
  }

  getOffers() {
    return Object.values(this.#offersByType);
  }

  getById(id) {
    return this.#offersById[id];
  }

  getByType(type) {
    return this.#offersByType[type];
  }
}
