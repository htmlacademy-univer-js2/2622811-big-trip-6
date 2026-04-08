import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import {render, replace} from '../framework/render';

export class EventPresenter {
  #event;
  #offersModel;
  #destinationsModel;
  #eventsContainer = null;
  #handleDataChange;
  #handleModeChange;
  #isEditing = false;
  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.swapToEvent();
    }
  };

  constructor({offersModel, destinationsModel, onDataChange, onModeChange}) {
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(eventsView, event) {
    this.#event = event;
    this.#eventsContainer = eventsView.element;

    const prevEventView = this.eventView;
    const prevEditEventView = this.editEventView;

    this.eventView = new EventView(
      this.#event,
      this.#event.offers.map((id) => this.#offersModel.getById(id)),
      this.#destinationsModel.getById(this.#event.destination),
      {
        onRollup: () => this.swapToEdit(),
        onFavoriteClick: () => this.#favoriteClickHandler(),
      }
    );
    this.editEventView = new EditEventView(
      this.#offersModel.getByType(this.#event.type),
      this.#destinationsModel.getById(this.#event.destination),
      this.#event,
      () => this.swapToEvent(),
    );

    if (prevEventView === undefined || prevEditEventView === undefined) {
      render(this.eventView, this.#eventsContainer);
    } else if (this.#isEditing) {
      replace(this.editEventView, prevEditEventView);
    } else {
      replace(this.eventView, prevEventView);
    }

    document.removeEventListener('keyup', this.#escKeyDownHandler);
    document.addEventListener('keyup', this.#escKeyDownHandler);
  }

  swapToEdit() {
    if(this.#isEditing) {
      return;
    }
    this.#handleModeChange();
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

  resetView() {
    this.swapToEvent();
  }

  #favoriteClickHandler() {
    this.#handleDataChange({
      ...this.#event,
      isFavorite: !this.#event.isFavorite,
    });
  }
}
