export class EventsModel {
  #events = {};

  constructor(events = []) {
    this.#events = Object.fromEntries(
      events.map((event) => [event.id, event])
    );
  }

  getEvents() {
    return Object.values(this.#events);
  }

  updateEvent(updatedEvent) {
    this.#events[updatedEvent.id] = updatedEvent;
  }
}
