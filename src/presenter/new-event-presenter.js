import dayjs from 'dayjs';
import EditEventView from '../view/edit-event-view';
import {render, remove, RenderPosition} from '../framework/render';
import {EVENT_TYPES, UserAction} from '../types';

const getDefaultEvent = (destinations) => {
  const start = dayjs().second(0).millisecond(0);

  return {
    id: crypto.randomUUID(),
    type: EVENT_TYPES[0],
    date: start.startOf('day').toDate(),
    start: start.toDate(),
    end: start.add(1, 'hour').toDate(),
    price: 0,
    destination: destinations[0]?.id,
    offers: [],
    isFavorite: false,
  };
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
      editingEvent: getDefaultEvent(destinations),
      destinations,
      offersModel: this.#offersModel,
      onSubmit: this.#handleFormSubmit,
      onDelete: this.destroy,
    });

    render(this.#editEventView, this.#eventsContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keyup', this.#escKeyDownHandler);
  }

  destroy = () => {
    remove(this.#editEventView);
    document.removeEventListener('keyup', this.#escKeyDownHandler);
    this.#handleDestroy();
  };

  #handleFormSubmit = (newEvent) => {
    this.#handleDataChange(UserAction.ADD_EVENT, newEvent);
  };
}
