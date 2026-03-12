import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

function createEditEventTemplate({id, type = EVENT_TYPES[0], price, start, end, offers: selectedOffers}, offers, destination) {
  const startTime = dayjs(start).format('DD/MM/YY HH:mm');
  const endTime = dayjs(end).format('DD/MM/YY HH:mm');

  const eventTypesTemplate = EVENT_TYPES.map((t) => `
    <div class="event__type-item">
      <input id="event-type-${t}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${t}" ${t === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${t}" for="event-type-${t}-1">${t}</label>
    </div>
  `).join('');

  const offersTemplate = offers.map(({id: offerId, title: offerTitle, price: offerPrice}) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerId}"
             type="checkbox" name="event-offer-${offerId}" ${selectedOffers?.includes(offerId) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offerId}">
        <span class="event__offer-title">${offerTitle}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerPrice}</span>
      </label>
    </div>
  `).join('');

  const destinationPhotosTemplate = destination?.pictures.map(({src, description}) => `
    <img class="event__photo" src="${src}" alt="${description}">
  `);

  return `
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price ?? 0}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${id ? 'Delete' : 'Cancel'}</button>
          ${id ? `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>` : ''}
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersTemplate}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination?.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${destinationPhotosTemplate}
              </div>
            </div>
          </section>
        </section>
      </form>`;
}

export default class EditEventView extends AbstractView {
  #editingEvent;
  #offers;
  #destination;

  constructor(offers, destination, editingEvent = null, onSubmit = () => {}) {
    super();
    this.#offers = offers;
    this.#destination = destination;
    this.#editingEvent = editingEvent;
    this.element.addEventListener('submit', onSubmit);
    if (editingEvent) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', onSubmit);
    }
  }

  get template() {
    return createEditEventTemplate(this.#editingEvent ?? {}, this.#offers, this.#destination);
  }
}
