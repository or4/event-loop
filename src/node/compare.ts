export function order1() {
    console.log('order1\n\n');

    setTimeout(() => console.log('set timeout 1'));
    setImmediate(() => console.log('setImmediate 1'));
    var intervalId1 = setInterval(() => {
        console.log('setInterval 1');
        clearInterval(intervalId1);
    });

    setTimeout(() => console.log('set timeout 2'));
    setImmediate(() => console.log('setImmediate 2'));
    var intervalId2 = setInterval(() => {
        console.log('setInterval 2');
        clearInterval(intervalId2);
    });

    /*
    YaBro
        setImmediate 1
        setImmediate 2
        set timeout 1
        setInterval 1
        set timeout 2
        setInterval 2

    */

    /*
    Node v10.14.2,
    Node v12.16.1,
    firefox
        set timeout 1
        setInterval 1
        set timeout 2
        setInterval 2
        setImmediate 1
        setImmediate 2
    */
}
// order1();
