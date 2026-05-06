import dayjs from 'dayjs';
import {getRandomElement, getRandomNumber} from '../utils';

export const DESTINATIONS = [
  {
    id: crypto.randomUUID(),
    name: 'Amsterdam',
    description: 'Amsterdam is a vibrant city with canals, cozy cafes, and museums around every corner.',
    pictures: [
      {
        src: 'https://picsum.photos/300/200?random=11',
        description: 'Amsterdam canal'
      },
      {
        src: 'https://picsum.photos/300/200?random=12',
        description: 'Amsterdam street'
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: 'Geneva',
    description: 'Geneva offers lakeside views, neat old streets, and calm promenades near the water.',
    pictures: [
      {
        src: 'https://picsum.photos/300/200?random=21',
        description: 'Geneva lake'
      },
      {
        src: 'https://picsum.photos/300/200?random=22',
        description: 'Geneva old town'
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    name: 'Chamonix',
    description: 'Chamonix is a mountain town with snowy peaks, scenic trails, and a lively alpine center.',
    pictures: [
      {
        src: 'https://picsum.photos/300/200?random=31',
        description: 'Chamonix mountains'
      },
      {
        src: 'https://picsum.photos/300/200?random=32',
        description: 'Chamonix street'
      }
    ]
  }
];

function createRandomSchedule() {
  const start = dayjs()
    .add(getRandomNumber(-7, 7), 'day')
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
    destination: getRandomElement(DESTINATIONS).id,
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
