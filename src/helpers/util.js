import _ from 'lodash';

export const randomIndex = arr => Math.floor(Math.random() * arr.length);

export const randomItem = arr => arr[randomIndex(arr)];

export const lastItem = arr => arr[arr.length - 1];

export const deepMapValues = (obj, fn) => _.mapValues(obj, (value) => {
  if (_.isPlainObject(value)) return deepMapValues(value, fn);
  return fn(value);
});
