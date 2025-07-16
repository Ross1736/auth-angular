import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { ITask, ITaskPost } from '../models/task.model';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  authService = inject(AuthService);

  private readonly apiUrl: string = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getTasks(): Observable<ITask[] | []> {
    const token = this.authService.getTokenSession();

    return this.http.get<ITask[] | []>(`${this.apiUrl}/task`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  postTask(task: ITaskPost): Observable<ITask> {
    const token = this.authService.getTokenSession();

    return this.http.post<ITask>(`${this.apiUrl}/task`, task, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
