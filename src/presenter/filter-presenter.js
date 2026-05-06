import FilterView from '../view/filter-view';
import {render, remove} from '../framework/render';
import {FilterType} from '../types';
import {filter} from '../utils/filter';

const FilterName = {
  [FilterType.EVERYTHING]: 'Everything',
  [FilterType.FUTURE]: 'Future',
  [FilterType.PRESENT]: 'Present',
  [FilterType.PAST]: 'Past',
};

const generateFilterItems = (events) => Object.values(FilterType).map((filterType) => ({
  id: filterType,
  name: FilterName[filterType],
  disabled: filter[filterType](events).length === 0,
}));

export default class FilterPresenter {
  #eventsModel;
  #filterModel;
  #filterContainer;
  #filterView = null;

  constructor({eventsModel, filterModel, filterContainer}) {
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#filterContainer = filterContainer;

    this.#eventsModel.addObserver(this.#handleEventsChange);
    this.#filterModel.addObserver(this.#handleFilterChange);
  }

  init() {
    const prevFilterView = this.#filterView;

    this.#filterView = new FilterView({
      filterItems: generateFilterItems(this.#eventsModel.getEvents()),
      selectedItem: this.#filterModel.getFilter(),
      onFilterTypeChange: this.#handleFilterTypeChange,
    });

    if (prevFilterView !== null) {
      remove(prevFilterView);
    }

    render(this.#filterView, this.#filterContainer);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.getFilter() === filterType) {
      return;
    }

    this.#filterModel.setFilter(filterType);
  };

  #handleFilterChange = () => {
    this.init();
  };

  #handleEventsChange = () => {
    this.init();
  };
}
