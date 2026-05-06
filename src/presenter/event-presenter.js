import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import {render, replace, remove} from '../framework/render';
import {UserAction} from '../types';

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
      {
        editingEvent: this.#event,
        destinations: this.#destinationsModel.getDestinations(),
        offersModel: this.#offersModel,
        onSubmit: (updatedEvent) => this.#handleEditFormSubmit(updatedEvent),
        onDelete: (deletedEvent) => this.#handleDeleteClick(deletedEvent),
        onRollup: () => this.swapToEvent(),
      }
    );

    if (prevEventView === undefined || prevEditEventView === undefined) {
      render(this.eventView, this.#eventsContainer);
    } else if (this.#isEditing) {
      replace(this.editEventView, prevEditEventView);
    } else {
      replace(this.eventView, prevEventView);
    }
  }

  swapToEdit() {
    if(this.#isEditing) {
      return;
    }
    this.#handleModeChange();
    replace(this.editEventView, this.eventView);
    this.#isEditing = true;
    document.addEventListener('keyup', this.#escKeyDownHandler);
  }

  swapToEvent() {
    if(!this.#isEditing) {
      return;
    }
    replace(this.eventView, this.editEventView);
    this.#isEditing = false;
    document.removeEventListener('keyup', this.#escKeyDownHandler);
  }

  resetView() {
    this.swapToEvent();
  }

  destroy() {
    remove(this.eventView);
    remove(this.editEventView);
    document.removeEventListener('keyup', this.#escKeyDownHandler);
  }

  #favoriteClickHandler() {
    this.#handleDataChange(UserAction.UPDATE_EVENT, {
      ...this.#event,
      isFavorite: !this.#event.isFavorite,
    });
  }

  #handleEditFormSubmit(updatedEvent) {
    this.#handleDataChange(UserAction.UPDATE_EVENT, updatedEvent);
  }

  #handleDeleteClick(deletedEvent) {
    this.#handleDataChange(UserAction.DELETE_EVENT, deletedEvent);
  }
}
