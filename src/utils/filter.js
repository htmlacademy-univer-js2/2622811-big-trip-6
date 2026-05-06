import {FilterType} from '../types';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => new Date(event.start) > new Date()),
  [FilterType.PRESENT]: (events) => events.filter((event) => new Date(event.start) <= new Date() && new Date(event.end) >= new Date()),
  [FilterType.PAST]: (events) => events.filter((event) => new Date(event.end) < new Date()),
};
