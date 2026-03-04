import {createElement} from '../render.js';

function createFilterTemplate({filterItems, selectedItem}) {
  const filtersTemplate = filterItems.map(({ id, name }) => `
    <div class="trip-filters__filter">
      <input id="filter-${id}"
             class="trip-filters__filter-input  visually-hidden"
             type="radio"
             name="trip-filter"
             value="${id}"
             ${selectedItem === id ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${id}">${name}</label>
    </div>
  `).join('');

  return `
    <div class="trip-main__trip-controls  trip-controls">
      <div class="trip-controls__filters">
        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
          ${filtersTemplate}
          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </div>
    </div>
  `;
}

const FILTERS = [
  {id: 'everything', name: 'Everything'},
  {id: 'future', name: 'Future'},
  {id: 'present', name: 'Present'},
  {id: 'past', name: 'Past'},
];

export default class FilterView {
  #element = null;
  #selectedItem = null;

  constructor(selectedItem) {
    this.#selectedItem = selectedItem;
  }

  get template() {
    return createFilterTemplate({filterItems: FILTERS, selectedItem: this.#selectedItem});
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
