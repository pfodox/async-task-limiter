import { IAsyncTask } from './types';

export class AsyncTask<T> implements IAsyncTask<T> {
  private task: Function;
  private onResolve: Function;

  public constructor(task: Function, onResolve: Function) {
    this.task = task;
    this.onResolve = onResolve;
  }

  public async run(): Promise<T> {
    const result = await this.task();

    this.onResolve(result);

    return result;
  }
}
