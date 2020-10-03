import { IAsyncTask, IAsyncTasksProcess } from './types';
import { AsyncTasksProcess } from './asyncTasksProcess';

interface IConcurentAsyncTaskQueueOptions<T> {
  tasks: IAsyncTask<T>[];
  concurrency?: number;
  stopOnAllVacant?: boolean;
}

export class ConcurentTaskQueue<T> {
  private concurrency: number;
  private stopOnAllVacant: boolean;
  private taskQueue: IAsyncTask<T>[] = [];
  private vacantWorkers: IAsyncTasksProcess<T>[] = [];
  private workers: IAsyncTasksProcess<T>[] = [];

  public constructor({ tasks, concurrency, stopOnAllVacant }: IConcurentAsyncTaskQueueOptions<T>) {
    this.taskQueue = tasks;
    this.concurrency = concurrency || 3;
    this.stopOnAllVacant = typeof stopOnAllVacant === 'undefined' ? true : stopOnAllVacant;
  }

  public async run() {
    for (let i = 0; i < this.concurrency; i++) {
      const taskProcess = new AsyncTasksProcess({
        task: this.taskQueue.shift(),
        onVacant: this.onNextTask,
      });

      this.workers.push(taskProcess);
    }

    await Promise.all(this.workers.map(this.startWorker));
  }

  public async addTask(task: IAsyncTask<T>) {
    if (this.vacantWorkers.length) {
      (this.vacantWorkers.shift() as IAsyncTasksProcess<T>).runTask(task);
    } else {
      this.taskQueue.push(task);
    }
  }

  public stopAllWorkers() {
    while (this.workers.length) {
      const vacantWorker: IAsyncTasksProcess<T> = this.workers.shift() as IAsyncTasksProcess<T>;
      vacantWorker.stopProcess();
    }
  }

  private onNextTask = (taskProcess: IAsyncTasksProcess<T>) => {
    if (this.taskQueue.length !== 0) {
      taskProcess.runTask(this.taskQueue.shift() as IAsyncTask<T>);
    } else {
      this.vacantWorkers.push(taskProcess);

      if (this.stopOnAllVacant && this.concurrency === this.vacantWorkers.length) {
        this.stopAllWorkers();
      }
    }
  };

  private async startWorker(worker: IAsyncTasksProcess<T>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    for await (let _ of worker as any) {
    }
  }
}
