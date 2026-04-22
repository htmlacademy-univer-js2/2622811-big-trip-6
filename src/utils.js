export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
