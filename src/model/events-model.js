export class EventsModel {
  #events = [];

  constructor(events = []) {
    this.#events = events;
  }

  getEvents() {
    return this.#events;
  }
}
