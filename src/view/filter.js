import {createElement} from '../render.js';

export default class FilterView {
  #element = null;
  #filterItems = [];
  #selectedItem = null;

  constructor(filterItems, selectedItem) {
    this.#filterItems = filterItems;
    this.#selectedItem = selectedItem;
  }

  get template() {
    return `
      <div class="trip-main__trip-controls  trip-controls">
        <div class="trip-controls__filters">
          <h2 class="visually-hidden">Filter events</h2>
          <form class="trip-filters" action="#" method="get">
            ${this.#renderFiltersTemplate()}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>
        </div>
      </div>
    `;
  }

  #renderFiltersTemplate() {
    return this.#filterItems.map(({ id, name }) => `
      <div class="trip-filters__filter">
        <input id="filter-${id}"
               class="trip-filters__filter-input  visually-hidden"
               type="radio"
               name="trip-filter"
               value="${id}"
               ${this.#selectedItem === id ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${id}">${name}</label>
      </div>
    `).join('');
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
