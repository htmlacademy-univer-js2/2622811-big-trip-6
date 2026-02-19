import {createElement} from '../render.js';

export default class EventView {
  #element = null;
  #date;
  #eventType;
  #title;
  #start;
  #end;
  #price;
  #offers;
  #isFavourite;

  constructor({
    date = new Date(),
    eventType = 'flight',
    title,
    start = new Date(),
    end = new Date(),
    price = 0,
    offers = [],
    isFavourite = false
  }) {
    this.#date = date;
    this.#eventType = eventType;
    this.#title = title;
    this.#start = start;
    this.#end = end;
    this.#price = price;
    this.#offers = offers;
    this.#isFavourite = isFavourite;
  }

  get template() {
    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${this.#date.toISOString().split('T')[0]}">
            ${this.#date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
          </time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${this.#eventType}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${this.#title}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${this.#start.toISOString()}">
                ${this.#start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </time>
              &mdash;
              <time class="event__end-time" datetime="${this.#end.toISOString()}">
                ${this.#end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
              </time>
            </p>
            <p class="event__duration">${Math.floor((this.#end.getTime() - this.#start.getTime()) / (1000 * 60))}M</p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this.#price}</span>
          </p>
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this.#renderOffersTemplate()}
          </ul>
          <button class="event__favorite-btn ${this.#isFavourite ? 'event__favorite-btn--active' : ''}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }

  #renderOffersTemplate() {
    return this.#offers.map(({title, price}) => `
        <li class="event__offer">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>
    `);
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.element = null;
  }
}
