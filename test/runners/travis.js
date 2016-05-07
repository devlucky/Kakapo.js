import * as specs from '../specs';

Object.keys(specs).forEach(specName => specs[specName]());
