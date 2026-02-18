import {createElement} from '../render.js';

export default class SortView {
  #element = null;
  #sortItems = [];
  #selectedItem = null;

  constructor(sortItems, selectedItem) {
    this.#sortItems = sortItems;
    this.#selectedItem = selectedItem;
  }

  get template() {
    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${this.#renderSortItemsTemplate()}
      </form>
    `;
  }

  #renderSortItemsTemplate() {
    return this.#sortItems.map(({ id, name, disabled = false }) => `
      <div class="trip-sort__item  trip-sort__item--${id}">
        <input
            id="sort-${id}"
            class="trip-sort__input  visually-hidden"
            type="radio"
            name="trip-sort"
            value="sort-${id}"
            ${this.#selectedItem === id ? 'checked' : ''}
            ${disabled ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="sort-${id}">${name}</label>
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
