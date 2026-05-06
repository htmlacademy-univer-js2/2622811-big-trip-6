export class EventsModel {
  #events = {};

  constructor(events = []) {
    this.setEvents(events);
  }

  getEvents() {
    return Object.values(this.#events);
  }

  setEvents(events) {
    this.#events = Object.fromEntries(
      events.map((event) => [event.id, event])
    );
  }

  updateEvent(updatedEvent) {
    this.#events[updatedEvent.id] = updatedEvent;
  }
}
