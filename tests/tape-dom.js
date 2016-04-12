import tape from 'tape';
import { 
  databaseSpec, 
  routerSpec,
  responseSpec,
  requestSpec
} from './specs';

document.addEventListener('DOMContentLoaded', init);

function init() {
  var tapeDom = require('tape-dom');

  tapeDom.installCSS();
  tapeDom.stream(tape);

  // databaseSpec(); 
  // routerSpec();
  // responseSpec();
  requestSpec();
}
