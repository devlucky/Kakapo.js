import _ from 'lodash';
import tape from 'tape';
import * as specs from '../specs';

_.forEach(specs, spec => spec());
