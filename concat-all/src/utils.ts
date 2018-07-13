import {map, scan, take, tap} from 'rxjs/operators';
import {timer} from "rxjs/observable/timer";

export function stream(name, delay, count, log?) {
    let s = timer(0, delay).pipe(map((v) => v + `-${name}`));
    if (count !== -1) {
        s = s.pipe(take(count));
    }

    if (log === 'full') {
        s = s.pipe(tap(fullObserver(name)));
    } else if (log === 'partial') {
        s = s.pipe(tap(partialObserver(name)));
    }

    return s;
}

export function fullObserver(stream) {
    return {
        next(v) {
            const message = stream.length < 5 ? `[${stream}]:\t\t${v}` : `[${stream}]:\t${v}`;
            log(message);
        },
        error() {
            const message = stream.length < 5 ? `[${stream}]:\t\tERROR` : `[${stream}]:\tERROR`;
            log(message);
        },
        complete() {
            const message = stream.length < 5 ? `[${stream}]:\t\tCOMPLETE` : `[${stream}]:\tCOMPLETE`;
            log(message);
        }
    }
}

export function partialObserver(stream) {
    return {
        error() {
            const message = stream.length < 5 ? `[${stream}]:\t\tERROR` : `[${stream}]:\tERROR`;
            log(message);
        },
        complete() {
            const message = stream.length < 5 ? `[${stream}]:\t\tCOMPLETE` : `[${stream}]:\tCOMPLETE`;
            log(message);
        }
    }
}

export function log(v) {
    document.body.querySelector('pre').appendChild(document.createElement('div')).textContent = v;
}

export function throwOnItem(count, stream) {
    return (source) => source.pipe(
        scan((acc, value) => [value, ...acc], []),
        map((values: Number[]) => {
            if (values.length === count) {
                throw new Error(`Error on the stream '${stream}'!`);
            }
            return values[0];
        }),
        tap(partialObserver(stream))
    )
}