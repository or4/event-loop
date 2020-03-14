// Кратко:
// 1. Создание промиса (весь код внутри function(resolve, reject)— исполняется вполне себе синхронно.
// 2. Для промисов и таймаутов в event loop предусмотрены 2 отдельные очереди,
// и очередь колбэков промисов исполняется перед очередью таймаутов.

// https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810

// *** There are 4 main types of queues that are processed by the native libuv event loop. ***

// * Expired timers and intervals queue — consists of callbacks of
//   expired timers added using setTimeout or interval functions added using setInterval.
// * IO Events Queue — Completed IO events
// * Immediates Queue — Callbacks added using setImmediate function
// * Close Handlers Queue— Any close event handlers.

// there are additionally 2 interesting queues as ‘intermediate queues’
// * Next Ticks Queue — Callbacks added using process.nextTick function
// * Other Microtasks Queue — Includes other microtasks such as RESOLVED PROMISE CALLBACKS

export function Case4() {
    console.log('Union case 4\n\n');
    setTimeout(() => console.log('set timeout 1'));

    Promise.resolve().then(() => {
        console.log('promise resolve 1');
        setTimeout(() => console.log('promise resolve set timeout 1'));
    });

    Promise.reject().catch(() => {
        console.log('promise reject 1');
        setTimeout(() => console.log('promise reject set timeout 1'));
    });

    new Promise(function(resolve) {
        console.log('new Promise 1');
        setTimeout(() => console.log('new Promise set timeout 1'));
        resolve();
    });

    console.log('console log 1');
    setTimeout(() => console.log('set timeout 3'));
    setImmediate(() => console.log('setImmediate 1'));
    var intervalId = setInterval(() => {
        console.log('setInterval 1');
        clearInterval(intervalId);
    });

    /*
    YaBro
        Union case 4
        new Promise 1
        console log 1
        promise resolve 1
        promise reject 1
        * setImmediate 1
        set timeout 1
        new Promise set timeout 1
        set timeout 3
        setInterval 1
        promise resolve set timeout 1
        promise reject set timeout 1
    */

    /*
    Node v10.14.2
        Union case 4
        new Promise 1
        console log 1
        promise resolve 1
        promise reject 1
        set timeout 1
        new Promise set timeout 1
        set timeout 3
        setInterval 1
        promise resolve set timeout 1
        * setImmediate 1
        promise reject set timeout 1
    */
}

export function Case5() {
    Promise.resolve().then(() => {
        console.log('promise resolve 1'); // 1
        setTimeout(() => console.log('promise resolve set timeout 1')); // 6
    });

    setTimeout(() => console.log('set timeout 1')); // 5

    setImmediate(() => {
        console.log('setImmediate 1'); // 2

        Promise.resolve().then(() => {
            console.log('promise resolve 2'); // 3
            setTimeout(() => console.log('promise resolve set timeout 2')); // 7
        });
    });

    setImmediate(() => {
        console.log('setImmediate 2'); // 4
    });

    console.log('console.log 1'); // 0
}

export function Case1() {
    console.log('new Promise(...');
    let a = 5;
    setTimeout(function timeout() {
        console.log(a);
        a = 10;
    }, 0);

    const p = new Promise(function(resolve) {
        console.log(a);
        a = 25;
        resolve();
    });

    p.then(function() {
        // some code
    });

    console.log(a);

    // 5 console.log(a) внутри промиса
    // 25 финальный console.log(a);
    // 25 console.log(a) из setTimeout
}

export function Case2() {
    console.log('Promise.resolve()');
    let a = 5;
    setTimeout(function timeout() {
        console.log(a);
        a = 10;
    }, 0);

    const p = Promise.resolve().then(function() {
        console.log(a);
        a = 25;
    });

    p.then(function() {
        // some code
    });

    console.log(a);

    // 5 финальный console.log(a);
    // 5 console.log(a) внутри промиса
    // 25 console.log(a) из setTimeout
}

export function Case3() {
    console.log('Promise.resolve() case 3');
    setTimeout(() => console.log('set timeout 1')); // 4
    setTimeout(() => console.log('set timeout 2')); // 5

    Promise.resolve()
        .then(() => {
            console.log('promise resolve 1'); // 2
            setTimeout(() => console.log('promise resolve set timeout 1')); // 7
        })
        .then(() => {
            setTimeout(() => console.log('promise resolve set timeout 2')); // 8
            console.log('promise resolve 2'); // 3
        });

    setTimeout(() => console.log('set timeout 3')); // 6
    console.log('console log 1'); // 1
}
