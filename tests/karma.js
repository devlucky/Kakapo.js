import tape from 'tape';
import { kakapoSpec, databaseSpec, routerSpec } from './specs';

//kakapoSpec();
databaseSpec();
routerSpec();
