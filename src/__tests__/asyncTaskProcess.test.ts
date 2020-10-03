//tslint:disable:no-any

import { AsyncTasksProcess } from '../asyncTasksProcess';

describe('asyncTaskProcess', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    it('Если не передали задачу - процесс оповещает, что он свободен', () => {
      const task = undefined;
      const onVacant = jest.fn();

      const asyncTask = new AsyncTasksProcess({ task, onVacant });

      expect(onVacant).toBeCalledWith(asyncTask);
    });
  });

  describe('iterator', () => {
    it('Если есть задача - выполнит ее и оповестит, что свободен для следующей задачи', async () => {
      const task = getTaskMock();
      const onVacant = jest.fn();

      const asyncTaskProcess = new AsyncTasksProcess({ task, onVacant });

      for await (let value of asyncTaskProcess as any) {
        asyncTaskProcess.stopProcess();

        expect(value).toEqual('task done');
      }

      expect(onVacant).toBeCalledWith(asyncTaskProcess);
    });

    it('Если нет задачи - будет крутить процесс с проверкой на наличие задачи, пока его не остановить', async () => {
      const task = undefined;
      const onVacant = jest.fn();

      const asyncTaskProcess = new AsyncTasksProcess({ task, onVacant });

      let counter = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (let _ of asyncTaskProcess as any) {
        counter++;
        if (counter === 5) {
          asyncTaskProcess.stopProcess();
        }
      }

      expect(counter).toEqual(5);
    });

    it('Процесс прокрутится несколько раз, после чего в него вбросится задача, он ее выполнит и оповестит, что освободился', async () => {
      const task = undefined;
      const onVacant = jest.fn();
      const futureTask = getTaskMock();

      const asyncTaskProcess = new AsyncTasksProcess({ task, onVacant });

      let counter = 0;

      for await (let value of asyncTaskProcess as any) {
        counter++;
        if (counter === 5) {
          asyncTaskProcess.runTask(futureTask);
        }

        if (value === 'task done') {
          asyncTaskProcess.stopProcess();
        }
      }

      expect(counter).toEqual(6);
      expect(futureTask.run).toBeCalled();
      expect(onVacant).toBeCalledTimes(2);
    });
  });
});

function getTaskMock() {
  return {
    run: jest.fn().mockResolvedValue('task done'),
  };
}
