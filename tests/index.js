import tape from 'tape';
import kakapoSpecs from './kakapo_spec';
import dbSpec from './db_spec';
import routerSpec from './router_spec';

document.addEventListener("DOMContentLoaded", init);

function init() {
  var tapeDom = require('tape-dom');

  tapeDom.installCSS();
  tapeDom.stream(tape);
  
  // kakapoSpecs()
  // dbSpec();
  routerSpec();
}