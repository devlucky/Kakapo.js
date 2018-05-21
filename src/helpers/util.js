import mapValues from 'lodash/mapvalues';
import isPlainObject from 'lodash/isplainobject';
import assignInWith from 'lodash/assigninwith';
import isUndefined from 'lodash/isundefined';
import isFunction from 'lodash/isfunction';

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
export const deepMapValues = (obj, fn) => mapValues(obj, (value) => {
  if (isPlainObject(value)) return deepMapValues(value, fn);
  return fn(value);
});

export const extendWithBind = (...args) =>
  assignInWith(...args, (objectValue, sourceValue, key, object, source) => {
    if (!isUndefined(objectValue)) { return objectValue; }
    if (isFunction(sourceValue)) { return sourceValue.bind(source); }
    return sourceValue;
  });
