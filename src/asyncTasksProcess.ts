import { IAsyncTask, IAsyncTasksProcess } from './types';

interface IAsyncTaskProcessOptions<T> {
  task: IAsyncTask<T> | undefined;

  onVacant(asyncTaskProcess: IAsyncTasksProcess<T>): void;
}

export class AsyncTasksProcess<T> implements IAsyncTasksProcess<T> {
  private done = false;
  private task: IAsyncTask<T> | undefined;
  private onVacant: (asyncTaskProcess: IAsyncTasksProcess<T>) => void;

  public constructor({ task, onVacant }: IAsyncTaskProcessOptions<T>) {
    this.task = task;
    this.onVacant = onVacant;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)[Symbol.asyncIterator] = this.iteratorEntry;

    if (!this.task) {
      onVacant(this);
    }
  }

  public runTask(task: IAsyncTask<T>) {
    this.task = task;
  }

  public stopProcess() {
    this.done = true;
  }

  private iteratorEntry() {
    return {
      next: this.iteratorNextFunction,
    };
  }

  private iteratorNextFunction = async () => {
    if (this.task) {
      const result = await this.task.run();

      this.task = undefined;
      this.onVacant(this);

      return { done: false, value: result };
    }

    if (this.done) {
      return { done: true };
    }

    await new Promise(resolve => setTimeout(resolve, 200));

    return { done: false };
  };
}
