# Async Task Limiter

### This library implements the limited asynchronous parallel fulfillment pattern

## Installing
Using npm:

```bash
 npm install async-task-limiter
```

Using yarn:

```bash
$ yarn add async-task-limiter
```

Example:

```typescript
import { AsyncTask, ConcurrentTaskQueue } from 'async-task-limiter';

// Just any async task function
const getTask = (taskNumber: number) => () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(taskNumber);
    }, 2000);
  })
};

// When the asynchronous task is executed this function will be called with resolved value
const onResolve = (taskNumber: number) => {
  console.log(`task №${ taskNumber } done`);
};

const asyncTask = new AsyncTask(getTask(1), onResolve);
const asyncTask2 = new AsyncTask(getTask(2), onResolve);
const asyncTask3 = new AsyncTask(getTask(3), onResolve);
const asyncTask4 = new AsyncTask(getTask(4), onResolve);
const asyncTask5 = new AsyncTask(getTask(5), onResolve);

const taskQueue = new ConcurrentTaskQueue({
  tasks: [asyncTask, asyncTask2, asyncTask3, asyncTask4, asyncTask5],
  concurrency: 2,
  stopOnAllVacant: true,
});

taskQueue.run();

```

## AsyncTask
Async task gets 2 arguments in constructor:
1) Async function which needs to be called
2) onResolve function - will be called after async task function fulfilled

## ConcurrentTaskQueue

Options
```typescript
interface IConcurrentTaskQueueOptions {
  // Async Tasks for execution in queue
  tasks: AsyncTask[];
  
  // Number of concurrent async tasks
  concurrency: number;
  
  // stop checking tasks array when all tasks finished
  stopOnAllVacant: boolean;
}
```

Support the author by subscribing to the telegram channel [@webchic](https://telegram.me/webchic) – 
Channel about web development: nodejs, webpack, css, html, javascript, typescript, angular etc...
