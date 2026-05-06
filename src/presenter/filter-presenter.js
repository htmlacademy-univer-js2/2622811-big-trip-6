import FilterView from '../view/filter-view';
import {render, remove} from '../framework/render';

export class FilterPresenter {
  #filterModel;
  #filterContainer;
  #filterView = null;

  constructor({filterModel, filterContainer}) {
    this.#filterModel = filterModel;
    this.#filterContainer = filterContainer;

    this.#filterModel.addObserver(this.#handleFilterChange);
  }

  init() {
    const prevFilterView = this.#filterView;

    this.#filterView = new FilterView({
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
}
