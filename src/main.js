import {PagePresenter} from './presenter/page-presenter';
import {EventsModel} from './model/events-model';

const eventsModel = new EventsModel();
const presenter = new PagePresenter({ eventsModel });
presenter.init();
