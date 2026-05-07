import dayjs from 'dayjs';
import Observable from '../framework/observable';

export default class EventsModel extends Observable {
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

  #translateEventToServer(event, removeId = false) {
    const {
      price: basePrice,
      start: dateFrom,
      end: dateTo,
      isFavorite,
      ...adaptedEvent
    } = event;
    delete adaptedEvent.destinations;
    delete adaptedEvent.date;

    if (removeId) {
      delete adaptedEvent.id;
    }

    return {
      ...adaptedEvent,
      'base_price': basePrice,
      'date_from': dayjs(dateFrom).toISOString(),
      'date_to': dayjs(dateTo).toISOString(),
      'is_favorite': isFavorite,
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

  async addEvent(newEvent) {
    const createdEvent = await this.#apiService.createPoint(
      this.#translateEventToServer(newEvent, true)
    );
    const adaptedEvent = this.#translateEventFromServer(createdEvent);

    this.#events[adaptedEvent.id] = adaptedEvent;
    this._notify();
  }

  async updateEvent(updatedEvent) {
    const event = await this.#apiService.updatePoint(
      this.#translateEventToServer(updatedEvent)
    );
    const adaptedEvent = this.#translateEventFromServer(event);

    this.#events[adaptedEvent.id] = adaptedEvent;
    this._notify();
  }

  async deleteEvent(eventId) {
    await this.#apiService.deletePoint({id: eventId});
    delete this.#events[eventId];
    this._notify();
  }
}
