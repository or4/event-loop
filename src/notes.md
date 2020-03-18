### Если кратко:

1. Создание промиса (весь код внутри function(resolve, reject)— исполняется вполне себе синхронно.
2. Для промисов и таймаутов в event loop предусмотрены 2 отдельные очереди,
и очередь колбэков промисов исполняется перед очередью таймаутов.

### Хороший цикл статей про event-loop

https://blog.insiderattack.net/event-loop-and-the-big-picture-nodejs-event-loop-part-1-1cb67a182810

#### There are 4 main types of queues that are processed by the native libuv event loop

* Expired timers and intervals queue — consists of callbacks of
  expired timers added using setTimeout or interval functions added using setInterval.
* IO Events Queue — Completed IO events
* Immediates Queue — Callbacks added using setImmediate function
* Close Handlers Queue— Any close event handlers.

#### There are additionally 2 interesting queues as ‘intermediate queues’

* Next Ticks Queue — Callbacks added using process.nextTick function
* Other Microtasks Queue — Includes other microtasks such as RESOLVED PROMISE CALLBACKS

### Статья setTimeout vs setImmediate vs nextTick

http://voidcanvas.com/setimmediate-vs-nexttick-vs-settimeout/

### Изучить

* Порядок вызовов setImmediate и setTimeout в разных браузерах и последней версии node.js
* Есть ли приоритет между Promise.resolve и Promise.reject
* Как в браузерах и node отрабатывает Other Microtasks Queue
* https://stackoverflow.com/questions/10344498/best-way-to-iterate-over-an-array-without-blocking-the-ui