# setImmediate() vs nextTick() vs setTimeout(fn,0) – in depth explanation

## source: http://voidcanvas.com/setimmediate-vs-nexttick-vs-settimeout/

Few days back, I was guiding some new node.js developers on making asynchronous stuffs. We were discussing about async apis of node js. I wanted to provide them with some references and googled for few; but surprisingly, majority of the articles out there in the internet about setImmediate() or process.nextTick() was containing insufficient or misleading information. And going through official documents of Node may not really be feasible for non-advanced developers. Hence I decided to come up with this article.

## Know the misconceptions first

Before I start describing anything, I would like to clear some of the misconceptions of the other articles, covering this topic. If you are not misled yet, you can skip this section.

### setImmediate() runs before setTimeout(fn, 0)

This is one of the most common misconceptions. I will discuss about the right concepts later on this article, but below is a proof of this statement being false.

```js
//index.js
setTimeout(function(){
    console.log("SETTIMEOUT");
});
setImmediate(function(){
    console.log("SETIMMEDIATE");
});

//run it
node index.js
```

If the statement above was true; running the above code would have given an output where SETIMMEDIATE would have been printed always before SETTIMEOUT. However in reality, the output of the above is not predictable. If you run node index.js multiple times, you will find multiple orders.

### setImmediate() puts the callback ahead of the job queue

```js
//index.js
setTimeout(function() {
    console.log("TIMEOUT 1");
    setImmediate(function() {
        console.log("SETIMMEDIATE 1");
    });
}, 0);
setTimeout(function() {
    console.log("TIMEOUT 2");
    setImmediate(function() {
        console.log("SETIMMEDIATE 2");
    });
}, 0);
setTimeout(function() {
    console.log("TIMEOUT 3");
}, 0);

//run it
node index.js
```

If the statement above was true; it would have produced the following output.

```js
TIMEOUT 1
SETIMMEDIATE 1
TIMEOUT 2
SETIMMEDIATE 2
TIMEOUT 3


TIMEOUT 1
TIMEOUT 2
TIMEOUT 3
SETIMMEDIATE 1
SETIMMEDIATE 2
```

### nextTick() triggers the callback on next tick (iteration)

Actually both process.nextTick() and setImmediate() was named wrongly. If we swap the names of those then the names will match the functionality. However as in JavaScript, they do not deprecate/change apis, so the named continued as wrong.
In terms of functionality, process.nextTick() is actually the way to invoke a callback immediately. Callback in setImmediate() will be triggered during/next iteration.

### How node.js event loop works

The only way to understand the workflow and the differences between these three functions; you must understand the functioning of the event loop. Hope you already know that event loop handles all async callbacks, but here we will discuss how it does so.

Though I am providing a short description of event loop here; but if you want to know it properly, you should read in depth explanation of event loop structure and workflow. (http://voidcanvas.com/nodejs-event-loop/)

[event-loop]: https://github.com/or4/event-loop/blob/master/src/event-loop-1.png "Event loop"

* **Timer**: It handles the callbacks assigned by setTimeout & setInterval after the given time threshold is completed.
* **I/O callbacks**: Handles all callbacks except the ones set by setTimeout, setInterval & setImmediate. It also does not have any close callbacks.
* **Idle, prepare**: Used internally.
* **Pole**: Retrieve new I/O events. This is which makes node a cool dude.
* **Check**: Here the callbacks of setImmediate() is handled.
* **Close callbacks**: Handles close connection callbacks etc. (eg: socket connection close)
* **nextTickQueue**: Holds the callbacks of process.nextTick(); but not a part of the event loop.

### How event loop propagates

It enters the Timer phase & checks if anything (callback) is there in the timer queue. If there are some, it starts executing one after another till either the queue is empty or the maximum allowed callback execution is completed.

After Timer it moves to the I/O callback phase where it again find the queue associated with it for i/o operations. It followed the similar approach as timer and after task done moves to the next phase.

Idle phase is used by node internally; for preparation etc. After that, the event loop enters the Poll phase where it handles events. If there is no event to be handled then also the event loops waits a bit in the poll phase for new i/o events. Nothing in the event loops works when poll phase is in waiting or sleep mode. However if there are some scripts assigned by setImmediate the event loop will end the poll phase and continue to the Check phase to execute those scheduled scripts.

After Check it will try executing anything in Close callbacks and after that goes back to Timer for the next iteration or tick.

Now about nextTickQueue. Any callbacks assigned by process.nextTick() is queued in the nextTickQueue and the event loop executes them one after another another, till the entire queue is drained out; after completing the ongoing operation; irrespective of which phase it is in.

This concludes the event loop description and now we may try to understand the three apis mentioned in the title of this article.

## setImmediate()

So first of all, by the workflow of event loop, now we can say setImmediate() is not exactly immediate, but the queue containing the callbacks of this, will be executed once in every iteration (when event loop is in Check phase).

So, the example in previous section; things were non-deterministic, because it depends on the performance of the process. Cause timer has an extra work of sorting, which takes some extra time to register it. However if we move the piece of code in an I/O callback; we can guarantee that the callback of setImmediate will be called before setTimeout, irrespective of anything else.

```js
//index.js
var fs = require('fs');
fs.readFile("my-file-path.txt", function() {
    setTimeout(function(){
        console.log("SETTIMEOUT");
    });
    setImmediate(function(){
        console.log("SETIMMEDIATE");
    });
});

//run it
node index.js

//output (always)
SETIMMEDIATE
SETTIMEOUT
```

## setTimeout(fn,0)

This also invokes the callback, but will not be executed till the event loop enters the Timer phase. So any setTimeout(fn, 0) along with setImmediate() in the Close callback phase will guarantee the execution of setTimeout 0 before the setImmediate. And accordingly, keeping the phase diagram of event loop in your mind, you can easily determine whether it’s setTimeout(fn, 0) or setImmediate() which will be called at the earliest.

## process.nextTick()

As per node.js documentation, “nextTickQueue will be processed after the current operation completes, regardless of the current phase of the event loop.”
It means, this queue will be executed whenever the boundary between JavaScript and C/C++ is crossed. So it’s not like it will be called after the task in the current phase only. Neither it means after the execution of the current callback. It is sometime before the next phase is hit.
