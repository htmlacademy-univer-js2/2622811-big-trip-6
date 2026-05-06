import AbstractView from '../framework/view/abstract-view';

function createFailedLoadMessageTemplate() {
  return '<p class="trip-events__msg">Failed to load latest route information</p>';
}

export default class FailedLoadMessageView extends AbstractView {
  get template() {
    return createFailedLoadMessageTemplate();
  }
}
