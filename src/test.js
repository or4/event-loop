//index.js
// setTimeout(function() {
//     console.log('SETTIMEOUT');
// });
// setImmediate(function() {
//     console.log('SETIMMEDIATE');
// });

setTimeout(function() {
    console.log('TIMEOUT 1');
    setImmediate(function() {
        console.log('SETIMMEDIATE 1');
    });
}, 0);
setTimeout(function() {
    console.log('TIMEOUT 2');
    setImmediate(function() {
        console.log('SETIMMEDIATE 2');
    });
}, 0);
setTimeout(function() {
    console.log('TIMEOUT 3');
}, 0);
