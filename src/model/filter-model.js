import Observable from '../framework/observable';
import {FilterType} from '../types';

export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING;

  getFilter() {
    return this.#filter;
  }

  setFilter(filter) {
    this.#filter = filter;
    this._notify(filter);
  }
}
