import { AsyncTask, ConcurrentTaskQueue } from '../src';

const getTask = (taskNumber: number) => () => {
  // @ts-ignore
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(taskNumber);
    }, 2000);
  })
};

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
