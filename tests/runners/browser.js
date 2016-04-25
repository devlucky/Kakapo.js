import tape from 'tape';
import {
  databaseSpec,
  routerSpec,
  responseSpec,
  requestSpec,
  serializerSpec
} from '../specs';

document.addEventListener('DOMContentLoaded', init);

function init() {
  var tapeDom = require('tape-dom');

  tapeDom.installCSS();
  tapeDom.stream(tape);

  serializerSpec();
  // databaseSpec();
  routerSpec();
  responseSpec();
}
