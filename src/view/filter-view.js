import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../types';

function createFilterTemplate({filterItems, selectedItem}) {
  const filtersTemplate = filterItems.map(({ id, name }) => `
    <div class="trip-filters__filter">
      <input id="filter-${id}"
             class="trip-filters__filter-input  visually-hidden"
             type="radio"
             name="trip-filter"
             value="${id}"
             data-filter-type="${id}"
             ${selectedItem === id ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${id}">${name}</label>
    </div>
  `).join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

const FILTERS = [
  {id: FilterType.EVERYTHING, name: 'Everything'},
  {id: FilterType.FUTURE, name: 'Future'},
  {id: FilterType.PRESENT, name: 'Present'},
  {id: FilterType.PAST, name: 'Past'},
];

export default class FilterView extends AbstractView{
  #selectedItem = null;
  #handleFilterTypeChange = null;

  constructor({selectedItem, onFilterTypeChange}) {
    super();
    this.#selectedItem = selectedItem;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate({filterItems: FILTERS, selectedItem: this.#selectedItem});
  }

  #filterTypeChangeHandler = (evt) => {
    if (!evt.target.matches('.trip-filters__filter-input')) {
      return;
    }

    this.#handleFilterTypeChange?.(evt.target.dataset.filterType);
  };
}
