import tape from 'tape';
import tapeDOM from 'tape-dom';
import * as specs from '../specs';

document.addEventListener('DOMContentLoaded', () => {
  tapeDOM.installCSS();
  tapeDOM.stream(tape);

  Object.keys(specs).forEach(specName => specs[specName]());
});
