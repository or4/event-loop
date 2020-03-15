export function case4() {
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

export function case5() {
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

export function case1() {
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

export function case2() {
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

export function case3() {
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
