import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';
import {encode} from '../utils/escape';

const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;

function formatDuration(start, end) {
  const durationMinutes = dayjs(end).diff(dayjs(start), 'minute');

  if (durationMinutes < MINUTES_IN_HOUR) {
    return `${durationMinutes}M`;
  }

  const days = Math.floor(durationMinutes / MINUTES_IN_DAY);
  const hours = Math.floor((durationMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const minutes = durationMinutes % MINUTES_IN_HOUR;

  if (durationMinutes < MINUTES_IN_DAY) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }

  return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
}

function createEventTemplate({date, type, start, end, price, isFavorite}, offers, destination) {
  const dateISO = dayjs(date).format('YYYY-MM-DD');
  const dateShort = dayjs(date).format('MMM DD');
  const startTimeISO = dayjs(start).toISOString();
  const startTime = dayjs(start).format('HH:mm');
  const endTimeISO = dayjs(end).toISOString();
  const endTime = dayjs(end).format('HH:mm');
  const duration = formatDuration(start, end);

  const title = `${encode(type)} ${encode(destination.name)}`;

  const offersTemplate = offers.map(({title: offerTitle, price: offerPrice}) => `
    <li class="event__offer">
      <span class="event__offer-title">${encode(offerTitle)}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offerPrice}</span>
    </li>
  `).join('');

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateISO}">${dateShort}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${encode(type)}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${title}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTimeISO}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endTimeISO}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
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

export default class EventView extends AbstractView {
  #event;
  #offers;
  #destination;

  constructor(event, offers, destination, {onRollup = () => {}, onFavoriteClick = () => {}} = {}) {
    super();
    this.#event = event;
    this.#offers = offers;
    this.#destination = destination;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', onRollup);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', onFavoriteClick);
  }

  get template() {
    return createEventTemplate(this.#event, this.#offers, this.#destination);
  }
}
