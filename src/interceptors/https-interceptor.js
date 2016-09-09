import { interceptorHelper } from './interceptorHelper';
import https from 'https';

let nativeGet;
const name = 'https';
const fakeGet = function(helpers) {
  // console.log('helpers', helpers);
  return function(options, cb) {
    const url = `${options.hostname}${options.path}`;
    const method = options.method;
    // console.log('fakeGet', options);
    return nativeGet.apply(null, arguments);
  };
};

export const enable = function(config) {
  nativeGet = nativeGet || https.get;

  https.get = fakeGet(interceptorHelper(config));
  // https.get = function(options, cb) {
  //   return nativeGet.apply(null, arguments);
  // };

  // function(options, cb) {
  //   console.log(arguments)
  //   return nativeGet.apply(null, arguments);
  //   // return get(options, cb);
  //   // console.log('https get', get);
  //   return get.apply(null, ...args);
  // }
};

export const disable = () => {
  
};