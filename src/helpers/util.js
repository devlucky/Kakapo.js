import _ from 'lodash';

/**
 * Returns copy of an object with mapped values. Works really similar to
 * lodash's mapValues, with difference that also EVERY nested object is
 * also mapped with passed function.
 *
 * @param {Object} obj - object to map values of
 * @param {Function} fn - function to map values with
 *
 * @returns {Object}
 * @private
 */
export const deepMapValues = (obj, fn) => _.mapValues(obj, (value) => {
  if (_.isPlainObject(value)) return deepMapValues(value, fn);
  return fn(value);
});
