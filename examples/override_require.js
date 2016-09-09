// const nativeRequire = require;
// global.require = require = (path) => {
//   console.log('override', path);

//   return nativeRequire(path);
// };

// console.log('fake', require);
// 
const http = require('http');

// http.request = () => {
//   console.log('request');
// };