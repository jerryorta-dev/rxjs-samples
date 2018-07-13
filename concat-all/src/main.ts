import {fullObserver, stream, log} from './utils';
import {concatAll, map, take} from "rxjs/operators";
import {interval} from "rxjs/observable/interval";
import { from } from "rxjs/observable/from"

const a = stream('a', 200, 3);
const b = stream('b', 200, 3); 

from([a, b]).pipe(concatAll()).subscribe(fullObserver('concatAll'));