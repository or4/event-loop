// 1. Создание промиса (весь код внутри function(resolve, reject)— исполняется вполне себе синхронно.
// 2. Для промисов и таймаутов в event loop предусмотрены 2 отдельные очереди,
// и очередь колбэков промисов исполняется перед очередью таймаутов.

export function Case4() {
    console.log('Union case 4\n\n');
    setTimeout(() => console.log('set timeout 1')); // 5

    Promise.resolve().then(() => {
        console.log('promise resolve 1'); // 3
        setTimeout(() => console.log('promise resolve set timeout 1')); // 8
    });

    Promise.reject().catch(() => {
        console.log('promise reject 1'); // 4
        setTimeout(() => console.log('promise reject set timeout 1')); // 9
    });

    new Promise(function(resolve) {
        console.log('new Promise 1'); // 1
        setTimeout(() => console.log('new Promise set timeout 1')); // 6
        resolve();
    });

    setTimeout(() => console.log('set timeout 3')); // 7
    console.log('console log 1'); // 2
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
