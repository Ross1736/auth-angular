import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IFormUser, IHttpErrorResponse } from '../../models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  router = inject(Router);
  authService = inject(AuthService);

  public errorMessage: string = '';
  public isLoading: boolean = false;

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get email() {
    return this.form.get('email') as FormControl<string>;
  }

  get password() {
    return this.form.get('password') as FormControl<string>;
  }

  constructor() {
    merge(this.email.statusChanges, this.password.statusChanges)
      .pipe(takeUntilDestroyed())
      .subscribe();
  }

  clickEvent(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  onLogin() {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;

    const formValue: IFormUser = this.form.value as IFormUser;

    this.authService.postLogin(formValue).subscribe({
      next: (response) => {
        this.authService.onSaveUserData(response.user);
        this.router.navigate(['/']);
        this.isLoading = false;
      },
      error: (error: IHttpErrorResponse) => {
        const msg = error.error.message;

        switch (msg) {
          case 'El correo no esta registrado':
            this.errorMessage = msg;
            this.form.reset();
            break;
          case 'Contraseña incorrecta':
            this.errorMessage = msg;
            this.form.get('password')?.reset();
            break;
          default:
            this.errorMessage = 'Error al ingresar';
        }

        this.isLoading = false;
      },
    });
  }

  clearError() {
    this.errorMessage = '';
  }
}
