export interface RESULT {
    event: string;
    time: number;
}

export const TIMED_RESULTS: RESULT[] = [];
export const RESULTS: string[] = [];

let startTime = 0;
export function log(...args: string[]) {
    const line = args.join(' ');

    if (startTime === 0) startTime = performance.now();

    const tick = Math.round((performance.now() - startTime) * 100) / 100;
    const tickStr = tick < 10 ? '0' + tick : tick;

    console.log(tickStr + ' ' + line);

    RESULTS.push(line);
    TIMED_RESULTS.push({ event: line, time: tick });
}

export function addResultToDocument(msg: string, type: string) {
    var el = document.createElement('div');

    if (type) {
        el.classList.add(type);
    }

    el.classList.add('result');
    el.innerText = msg;

    document.body.appendChild(el);
}

export function reportError(msg: string) {
    addResultToDocument(msg, 'error');
}

export function assertOrder(r1: string, r2: string, msg: string) {
    var i1 = RESULTS.indexOf(r1);
    var i2 = RESULTS.indexOf(r2);

    if (i1 === -1) {
        reportError(r1 + ' not found');
    }

    if (i2 === -1) {
        reportError(r2 + ' not found');
    }

    if (i2 <= i1) {
        reportError('"' + r1 + '" before "' + r2 + '": ' + msg);
    }
}

export function endTest() {
    return false;

    // Promise/rAF asserts
    // assertOrder('script end', 'promise A', 'promise handlers executed after script');
    // assertOrder('promise A', 'promise B', 'promise handlers in order');

    // assertOrder('rAF A', 'rAF B', 'rAF in order');

    // assertOrder('promise A', 'rAF A', 'rAF after promise handlers');

    // assertOrder('promise A', 'timeout A', 'timeout after promise handlers');
    // assertOrder('rAF A promise', 'rAF B', 'promise handler immediately after rAF');

    // const p1 = RESULTS.indexOf('promise B');
    // const p0 = RESULTS.indexOf('promise A');

    // if (p1 - p0 > 2) {
    //     reportError('Microtasks queue not executed all at once, distance is ' + (p1 - p0));
    // }

    // assertOrder('promise A', 'mutate', 'mutate microtask after promise A');
    // assertOrder('mutate', 'promise B', 'mutate happens before promise B resolves');

    // // render events
    // assertOrder('matchMedia', 'resize', 'matchMedia before resize');
    // assertOrder('resize', 'scroll', 'resize before scroll');
    // assertOrder('scroll', 'rAF A', 'scroll before rAF');
    // assertOrder('animationstart', 'rAF A', 'css animation starts before rAF');
    // assertOrder('resize', 'animationstart', 'css animation starts before rAF');

    // //  addResultToDocument("rAF and timeout order is unspecified", "warn");
    // if (!document.querySelector('.error')) {
    //     addResultToDocument('tests passed', 'info');
    // }

    // const slider = document.querySelector('#slider');
    // slider && slider.classList.remove('animate');

    // addResultToDocument('output in console', 'info');
}

export function resetResult() {
    RESULTS.length = 0;

    const oldResults = document.querySelectorAll('.result');

    for (var i = 0; i < oldResults.length; i++) {
        const result = oldResults[i];

        // @ts-ignore
        result.parentNode.removeChild(result);
    }
}
