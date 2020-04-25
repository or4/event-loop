import * as React from 'react';
import { log, endTest, resetResult } from './utils';

import './test.css';

declare global {
    interface Window {
        ResizeObserver: any;
    }
}

export class App extends React.Component {
    public componentDidMount() {
        startTest();
    }
    public render() {
        return <div>App</div>;
    }
}

export function startTest() {
    resetResult();

    log('script start');

    requestAnimationFrame(function() {
        log('rAF 1');

        if (window.ResizeObserver) {
            const resizeObserver = new window.ResizeObserver(function() {
                log('raf 1 ResizeObserver');
            });

            resizeObserver.observe(document.querySelector('#mutator'));
        }

        new Promise(function(fulfill) {
            log('rAF 1 promise fulfill');
            fulfill();
        })
            .then(function() {
                log('rAF 1 promise then 1');
            })
            .then(function() {
                log('rAF 1 promise then 2');
            });
    });

    requestAnimationFrame(function() {
        log('rAF 2');
    });

    setImmediate(function() {
        log('setImmediate 1');
    });

    setTimeout(function() {
        log('setTimeout 1');
    }, 0);

    const interval1 = setInterval(function() {
        log('setInterval 1');
        clearInterval(interval1);
    }, 0);

    setTimeout(function() {
        log('setTimeout 2');
    }, 0);

    const interval2 = setInterval(function() {
        log('setInterval 2');
        clearInterval(interval2);
    }, 0);

    setImmediate(function() {
        log('setImmediate 2');
    });

    Promise.resolve()
        .then(function() {
            log('promise 1 then 1');
            return new Promise(function(fulfill) {
                log('promise 1 then 1 fulfill');
                fulfill();
            });
        })
        .then(function() {
            log('promise 1 then 2');
        });

    new Promise(function(fulfill) {
        log('promise 2 fulfill');
        fulfill();
    }).then(function() {
        log('promise 2 then');
    });

    const slider = document.querySelector('#slider');
    if (slider) {
        slider.classList.remove('animate');
        slider.classList.add('animate');
    }

    window.scrollBy(0, 10);

    // try {
    //     // @ts-ignore
    //     window.parent.document.querySelector('iframe').width = '450px';
    // } catch (ex) {
    //     console.error('resize not tested, not an iframe');
    // }

    if (window.ResizeObserver) {
        const resizeObserver = new window.ResizeObserver(function() {
            log('ResizeObserver script');
        });

        resizeObserver.observe(document.querySelector('#mutator'));
    }

    // const mutator = document.querySelector('#mutator');
    // if (mutator) {
    //     mutator.appendChild(document.createElement('div'));
    // }

    // Test end
    // window.setTimeout(function() {
    //     endTest();
    // }, 500);

    log('script end');
}

// // Listeners
// window.addEventListener('resize', function() {
//     log('resize');
// });

// window.addEventListener('scroll', function() {
//     log('scroll');
// });

// window.matchMedia('(min-width: 400px)').addListener(function() {
//     log('matchMedia');
// });

// const slider = document.querySelector('#slider');
// if (slider) {
//     slider.addEventListener('animationstart', function() {
//         log('animationstart');
//     });
// }

// const mutator = document.querySelector('#mutator');
// if (mutator) {
//     var mutationObserver = new MutationObserver(function() {
//         log('mutate');
//     });
//     mutationObserver.observe(mutator, { childList: true, attributes: true });
// }

// window.addEventListener('message', function(ev) {
//     switch (ev.data) {
//         case 'startTest':
//             window.requestAnimationFrame(startTest);
//             break;
//         default:
//             break;
//     }
// });
