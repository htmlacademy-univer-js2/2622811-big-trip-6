import dayjs from 'dayjs';
import {getRandomElement, getRandomNumber} from '../utils';

function createRandomSchedule() {
  const start = dayjs('2019-03-18')
    .add(getRandomNumber(-3, 7), 'day')
    .hour(getRandomNumber(0, 23))
    .minute(getRandomNumber(0, 3) * 15)
    .second(0)
    .millisecond(0);
  const end = start.add(getRandomNumber(1, 24) * 30, 'minute');

  return {
    date: start.startOf('day'),
    start,
    end,
  };
}

export function createRandomEvent(type) {

  return {
    id: crypto.randomUUID(),
    ...createRandomSchedule(),
    type,
    price: Math.round(Math.random() * 100),
    destination: crypto.randomUUID(),
    offers: Array.from({ length: Math.round(Math.random() * 3) + 1 }, () => crypto.randomUUID()),
    isFavorite: false,
  };
}

export function createOffers(type, ids) {
  return {
    type,
    offers: ids.map((id) =>
      ({
        id,
        title: getRandomElement(['Upgrade to a business class', 'Add meal', 'Choose seats']),
        price: Math.round(Math.random() * 100)
      })
    )
  };
}

export function createDestination(id) {
  return {
    id,
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Chamonix parliament building'
      }
    ]
  };
}
