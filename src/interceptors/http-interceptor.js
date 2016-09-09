const http = require('http');

let nativeHttp;
const name = 'http';
const fakeService = helpers => (url, options = {}) => {

};

export const enable = (config) => {
  nativeHttp = nativeHttp || http;
  console.log('httpinterceptor enable');
};
export const disable = () => {
  
};