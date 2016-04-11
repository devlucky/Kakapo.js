import tape from 'tape';
import { kakapoSpec, databaseSpec, routerSpec } from './specs';

document.addEventListener('DOMContentLoaded', init);

function init() {
  var tapeDom = require('tape-dom');

  tapeDom.installCSS();
  tapeDom.stream(tape);

  //kakapoSpec();
  databaseSpec();
  routerSpec();
}
