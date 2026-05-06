import EditEventView from '../view/edit-event-view';
import {render, remove, RenderPosition} from '../framework/render';
import {UserAction} from '../types';

const DEFAULT_EVENT = {
  type: 'flight',
  date: null,
  start: null,
  end: null,
  price: 0,
  destination: null,
  offers: [],
  isFavorite: false,
};

export class NewEventPresenter {
  #eventsContainer = null;
  #offersModel;
  #destinationsModel;
  #handleDataChange;
  #handleDestroy;
  #editEventView = null;

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };

  constructor({eventsContainer, offersModel, destinationsModel, onDataChange, onDestroy}) {
    this.#eventsContainer = eventsContainer;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    const destinations = this.#destinationsModel.getDestinations();

    this.#editEventView = new EditEventView({
      editingEvent: structuredClone(DEFAULT_EVENT),
      destinations,
      offersModel: this.#offersModel,
      onSubmit: this.#handleFormSubmit,
      onDelete: this.destroy,
      onRollup: this.destroy,
    });

    render(this.#editEventView, this.#eventsContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keyup', this.#escKeyDownHandler);
  }

  destroy = () => {
    remove(this.#editEventView);
    document.removeEventListener('keyup', this.#escKeyDownHandler);
    this.#handleDestroy();
  };

  #handleFormSubmit = async (newEvent) => {
    this.#editEventView.setSaving();

    try {
      await this.#handleDataChange(UserAction.ADD_EVENT, newEvent);
    } catch {
      this.#editEventView.resetControls();
      this.#editEventView.shake();
    }
  };
}
