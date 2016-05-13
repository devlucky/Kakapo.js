import _ from 'lodash';

export const deepMapValues = (obj, fn) => _.mapValues(obj, (value) => {
  if (_.isPlainObject(value)) return deepMapValues(value, fn);
  return fn(value);
});
