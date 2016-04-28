import tape from 'tape';
import {
  databaseSpec,
  routerSpec,
  responseSpec,
  requestSpec,
  serializerSpec,
  relationshipsSpec
} from '../specs';

document.addEventListener('DOMContentLoaded', init);

function init() {
  var tapeDom = require('tape-dom');

  tapeDom.installCSS();
  tapeDom.stream(tape);

  relationshipsSpec();
  // serializerSpec();
  // databaseSpec();
  // serializerSpec();
  // databaseSpec();
  // routerSpec();
  // responseSpec();
}
