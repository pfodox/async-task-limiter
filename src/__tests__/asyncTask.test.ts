//tslint:disable:no-any

import { AsyncTask } from '../asyncTask';

describe('asyncTask', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('run', () => {
    it('После окончания задачи вызывается заданный callback', async () => {
      const task = () => new Promise(resolve => setTimeout(() => resolve('task done'), 10));
      const onResolve = jest.fn();

      const asyncTask = new AsyncTask(task, onResolve);
      await asyncTask.run();

      expect(onResolve).toBeCalledWith('task done');
    });

    it('Задача возвращает результат выполнения', async () => {
      const task = () => new Promise(resolve => setTimeout(() => resolve('task done'), 10));
      const onResolve = jest.fn();

      const asyncTask = new AsyncTask(task, onResolve);
      const result = await asyncTask.run();

      expect(result).toEqual('task done');
    });
  });
});
