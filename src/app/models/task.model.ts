export interface ITask {
  id: number;
  user_id: string;
  title: string;
  description: string;
  done: boolean;
  created: string;
  updated: string;
}

export interface ITasksTable extends Omit<ITask, 'user_id' | 'updated'> {}

export interface ITaskPost extends Pick<ITask, 'title' | 'description'> {}
