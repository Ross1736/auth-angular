import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { MatButtonModule } from '@angular/material/button';
import { TasksService } from '../../services/tasks-service';
import { ITasksTable } from '../../models/task.model';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Check,
  LucideAngularModule,
  SquarePlus,
  SquareX,
  X,
} from 'lucide-angular';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  router = inject(Router);
  authService = inject(AuthService);
  tasksService = inject(TasksService);
  cdr = inject(ChangeDetectorRef);

  readonly SquarePlus = SquarePlus;
  readonly SquareX = SquareX;
  readonly Check = Check;
  readonly X = X;

  hasTemporaryRow = false;

  displayedColumns: string[] = [
    'id',
    'title',
    'description',
    'done',
    'created',
  ];
  // dataSource: ITasksTable[] = [];
  dataSource = new MatTableDataSource<ITasksTable>();

  @ViewChild(MatTable) table!: MatTable<ITasksTable>;

  addDataTable() {
    if (this.hasTemporaryRow) {
      return;
    }

    const newTask: ITasksTable = {
      id: 0,
      title: '',
      description: '',
      done: false,
      created: '',
    };

    this.dataSource.data = [newTask, ...this.dataSource.data];
    this.table.renderRows();
    this.hasTemporaryRow = true;
  }

  removeDataTable() {
    if (!this.hasTemporaryRow) return;

    this.dataSource.data = this.dataSource.data.filter((task) => task.id !== 0);
    this.table.renderRows();
    this.hasTemporaryRow = false;
  }

  get isSaveDisabled(): boolean {
    if (!this.hasTemporaryRow) return true;

    const tempTask = this.dataSource.data.find((task) => task.id === 0);
    return !tempTask?.title?.trim() || !tempTask?.description?.trim();
  }

  // Métodos de usuario
  ngOnInit() {
    this.tasksService.getTasks().subscribe({
      next: (response) => {
        this.dataSource.data = response
          .sort((a, b) => b.id - a.id)
          .map((task) => {
            return {
              id: task.id,
              title: task.title,
              description: task.description,
              done: task.done,
              created: task.created,
            };
          });
      },
      error: (error) => console.log(error),
    });
  }

  onPostTask() {
    const tempTask = this.dataSource.data.find((task) => task.id === 0);

    if (!tempTask?.title?.trim() || !tempTask?.description?.trim()) {
      return;
    }

    this.tasksService
      .postTask({ title: tempTask.title, description: tempTask.description })
      .subscribe({
        next: (_response) => {
          this.hasTemporaryRow = false;
          this.ngOnInit();
        },
        error: (error) => console.log(error),
      });
  }

  onLogout() {
    this.authService.Logout();
    this.router.navigate(['/login']);
  }
}
