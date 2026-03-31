import AbstractView from '../framework/view/abstract-view';

function createMessageTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class EmptyMessageView extends AbstractView {
  get template() {
    return createMessageTemplate();
  }
}
