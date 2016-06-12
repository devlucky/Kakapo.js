import tape from 'tape';
import tapeDOM from 'tape-dom';
import * as specs from '../specs';
import * as integrationSpecs from '../specs/integration';

document.addEventListener('DOMContentLoaded', () => {
  tapeDOM.installCSS();
  tapeDOM.stream(tape);
  
  Object.keys(specs).forEach(specName => specs[specName]());
  Object.keys(integrationSpecs).forEach(specName => integrationSpecs[specName]());
});
