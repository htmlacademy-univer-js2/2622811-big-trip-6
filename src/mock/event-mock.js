import dayjs from 'dayjs';

export function createRandomEvent() {
  return {
    id: crypto.randomUUID(),
    date: dayjs('2019-03-18'),
    type: 'taxi',
    start: dayjs('2019-03-18T10:30'),
    end: dayjs('2019-03-18T11:00'),
    price: 1230,
    destination: crypto.randomUUID(),
    offers: Array.from({ length: 2 }, () => crypto.randomUUID()),
    isFavorite: false,
  };
}

export function createOffers(type, ids) {
  return {
    type,
    offers: ids.map((id) =>
      ({
        id,
        title: 'Upgrade to a business class',
        price: 120
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
