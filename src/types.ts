export interface IAsyncTask<T> {
  run(): Promise<T>;
}

export interface IAsyncTasksProcess<T> {
  runTask(task: IAsyncTask<T>): void;

  stopProcess(): void;
}
