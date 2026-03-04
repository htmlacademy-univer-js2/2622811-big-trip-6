import {createElement} from '../render.js';

function createEventsTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class EventsView {
  #element = null;

  get template() {
    return createEventsTemplate();
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
