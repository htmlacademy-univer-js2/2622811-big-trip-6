import {createElement} from '../render.js';

export default class InfoView {
  #element = null;
  #title = null;
  #dates = null;
  #cost = 0;

  constructor(title, dates, cost) {
    this.#title = title;
    this.#dates = dates;
    this.#cost = cost;
  }

  get template() {
    return `
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${this.#title}</h1>
          <p class="trip-info__dates">${this.#dates}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${this.#cost}</span>
        </p>
      </section>
    `;
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
