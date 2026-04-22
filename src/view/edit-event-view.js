import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {EVENT_TYPES} from '../types.js';

function createEditEventTemplate(state) {
  const {
    id,
    type = EVENT_TYPES[0],
    price,
    start,
    end,
    offers: selectedOffers,
    availableOffers,
    destination,
    destinations,
  } = state;

  const startTime = dayjs(start).format('DD/MM/YY HH:mm');
  const endTime = dayjs(end).format('DD/MM/YY HH:mm');

  const eventTypesTemplate = EVENT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${eventType === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
    </div>
  `).join('');

  const destinationOptionsTemplate = destinations.map(({name}) => `<option value="${name}"></option>`).join('');

  const offersTemplate = availableOffers.map(({id: offerId, title: offerTitle, price: offerPrice}) => `
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
  `).join('');

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name ?? ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationOptionsTemplate}
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
          ${destination ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${destinationPhotosTemplate}
              </div>
            </div>
          </section>` : ''}
        </section>
      </form>`;
}

function parseState(editingEvent, destinations, availableOffers) {
  const currentDestination = destinations.find(({id}) => id === editingEvent.destination);

  return {
    ...editingEvent,
    date: editingEvent.date ? dayjs(editingEvent.date).toDate() : null,
    start: editingEvent.start ? dayjs(editingEvent.start).toDate() : null,
    end: editingEvent.end ? dayjs(editingEvent.end).toDate() : null,
    destinations,
    availableOffers,
    destination: currentDestination,
  };
}

export default class EditEventView extends AbstractStatefulView {
  #destinations;
  #offersModel;
  #onSubmit;
  #startDatepicker = null;
  #endDatepicker = null;

  constructor({editingEvent = null, destinations = [], offersModel, onSubmit = () => {}} = {}) {
    super();

    this.#destinations = destinations;
    this.#offersModel = offersModel;
    this.#onSubmit = onSubmit;

    this._setState(parseState(
      editingEvent ?? {},
      this.#destinations,
      this.#offersModel?.getByType(editingEvent?.type) ?? []
    ));

    this._restoreHandlers();
  }

  get template() {
    return createEditEventTemplate(this._state);
  }

  get editedEvent() {
    const form = this.element;
    const destinationName = form.querySelector('.event__input--destination').value;
    const selectedDestination = this.#destinations.find(({name}) => name === destinationName) ?? null;
    const {
      availableOffers,
      destination: currentDestination,
      ...event
    } = this._state;

    return {
      ...event,
      destination: selectedDestination?.id ?? currentDestination?.id,
      offers: availableOffers
        .filter(({id}) => form.querySelector(`#event-offer-${id}`)?.checked)
        .map(({id}) => id),
      price: Number(form.querySelector('#event-price-1').value),
    };
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.#setDatepickers();

    const rollupButton = this.element.querySelector('.event__rollup-btn');
    rollupButton?.addEventListener('click', this.#rollupClickHandler);
  }

  removeElement() {
    this.#destroyDatepickers();
    super.removeElement();
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmit(this.editedEvent);
  };

  #rollupClickHandler = () => {
    this.#onSubmit(this.editedEvent);
  };

  #typeChangeHandler = (evt) => {
    if (!evt.target.matches('.event__type-input')) {
      return;
    }

    this.updateElement({
      type: evt.target.value,
      offers: [],
      availableOffers: this.#offersModel?.getByType(evt.target.value) ?? [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find(({name}) => name === evt.target.value);

    if (!selectedDestination) {
      this.updateElement({
        destination: null,
      });

      return;
    }

    this.updateElement({
      destination: selectedDestination,
    });
  };

  #setDatepickers() {
    const config = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
    };
    this.#startDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...config,
        defaultDate: this._state.start,
        onChange: this.#startDateChangeHandler,
      },
    );

    this.#endDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...config,
        defaultDate: this._state.end,
        onChange: this.#endDateChangeHandler,
      },
    );
  }

  #destroyDatepickers() {
    this.#startDatepicker?.destroy();
    this.#endDatepicker?.destroy();
    this.#startDatepicker = null;
    this.#endDatepicker = null;
  }

  #startDateChangeHandler = ([selectedDate]) => {
    if (!selectedDate) {
      return;
    }

    this._setState({
      start: selectedDate,
      date: dayjs(selectedDate).startOf('day').toDate(),
    });
  };

  #endDateChangeHandler = ([selectedDate]) => {
    if (!selectedDate) {
      return;
    }

    this._setState({
      end: selectedDate,
    });
  };
}
