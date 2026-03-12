import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import {render, replace} from '../framework/render';

export class EventPresenter {
  #event;
  #offersModel;
  #destinationsModel;
  #isEditing = false;
  constructor(event, offersModel, destinationsModel) {
    this.#event = event;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  render(eventsView) {
    this.eventView = new EventView(
      this.#event,
      this.#event.offers.map((id) => this.#offersModel.getById(id)),
      this.#destinationsModel.getById(this.#event.destination),
      () => this.swapToEdit(),
    );
    this.editEventView = new EditEventView(
      this.#offersModel.getByType(this.#event.type),
      this.#destinationsModel.getById(this.#event.destination),
      this.#event,
      () => this.swapToEvent(),
    );
    render(this.eventView, eventsView.element);

    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        this.swapToEvent();
      }
    });
  }

  swapToEdit() {
    if(this.#isEditing) {
      return;
    }
    replace(this.editEventView, this.eventView);
    this.#isEditing = true;
  }

  swapToEvent() {
    if(!this.#isEditing) {
      return;
    }
    replace(this.eventView, this.editEventView);
    this.#isEditing = false;
  }
}
