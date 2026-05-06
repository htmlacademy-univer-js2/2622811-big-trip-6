import dayjs from 'dayjs';
import Observable from '../framework/observable';

export class EventsModel extends Observable {
  #apiService = null;
  #events = {};
  #isLoaded = false;
  #isFailed = false;

  constructor({apiService}) {
    super();
    this.#apiService = apiService;
    apiService.getPoints().then((events) => {
      this.setEvents(events.map((event) => this.#translateEventFromServer(event)));
    }).catch(() => {
      this.#isFailed = true;
      this.setEvents([]);
    });
  }

  #translateEventFromServer({
    base_price: price,
    date_from: dateFrom,
    date_to: dateTo,
    is_favorite: isFavorite, ...event
  }) {
    const start = dayjs(dateFrom);
    const end = dayjs(dateTo);

    return {
      ...event,
      isFavorite,
      price,
      date: start.startOf('day'),
      start,
      end,
    };
  }

  getEvents() {
    return Object.values(this.#events);
  }

  get isLoaded() {
    return this.#isLoaded;
  }

  get isFailed() {
    return this.#isFailed;
  }

  setEvents(events) {
    this.#events = Object.fromEntries(
      events.map((event) => [event.id, event])
    );
    this.#isLoaded = true;
    this._notify();
  }

  updateEvent(updatedEvent) {
    this.#events[updatedEvent.id] = updatedEvent;
  }

  deleteEvent(eventId) {
    delete this.#events[eventId];
  }
}
