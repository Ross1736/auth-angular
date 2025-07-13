import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IHttpErrorResponse } from '../../models/user.model';

@Component({
  selector: 'app-recovery',
  imports: [
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './recovery.html',
  styleUrl: './recovery.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Recovery {
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  authService = inject(AuthService);

  public errorMessage: string = '';
  public isLoading: boolean = false;

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get email() {
    return this.form.get('email') as FormControl<string>;
  }

  constructor() {
    merge(this.email.statusChanges).pipe(takeUntilDestroyed()).subscribe();
  }

  onRecovery() {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;

    this.authService.postRecoveryPassword(this.email.value).subscribe({
      next: (response) => {
        this.errorMessage = response.message;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error: IHttpErrorResponse) => {
        this.errorMessage = error.error.message;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  clearError() {
    this.errorMessage = '';
  }
}
