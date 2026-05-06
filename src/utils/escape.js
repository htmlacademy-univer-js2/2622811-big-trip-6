import he from 'he';

const encode = (value) => he.encode(String(value ?? ''));

export {encode};
