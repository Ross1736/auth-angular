import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { IHttpErrorResponse } from '../../models/user.model';

@Component({
  selector: 'app-reset-password',
  imports: [
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword {
  private readonly activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);

  cdr = inject(ChangeDetectorRef);
  emailUser = signal('');
  errorMessage: string = '';
  isLoading: boolean = false;

  readonly form = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    code: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const email = params['email'] || '';
      this.emailUser.set(email);
      this.form.get('email')?.setValue(email);
    });

    this.form.get('code')?.valueChanges.subscribe((value) => {
      const upper = value!.toUpperCase();

      if (value !== upper) {
        this.form.get('code')?.setValue(upper, { emitEvent: false });
      }
    });
  }

  get email() {
    return this.form.get('email') as FormControl<string>;
  }

  get password() {
    return this.form.get('password') as FormControl<string>;
  }

  get code() {
    return this.form.get('code') as FormControl<string>;
  }

  onResetPassword() {
    if (this.form.invalid || this.isLoading) return;
    this.isLoading = true;

    this.authService
      .patchRecoveryPassword({
        email: this.email.value,
        password: this.password.value,
        code: this.code.value,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.status === 200) {
            this.router.navigate(['/login']);
          }
        },
        error: (error: IHttpErrorResponse) => {
          const msg = error.error.message;

          switch (msg) {
            case 'El código de recuperación no es válido':
            case 'El código de recuperación ha caducado':
              this.errorMessage = msg;
              this.form.get('code')?.reset();
              break;
            case 'Ya has cambiado tu contraseña, inténtalo de nuevo mañana':
              this.errorMessage = msg;
              break;
            default:
              this.errorMessage = 'Error al actualizar la contraseña';
          }

          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  clearError() {
    this.errorMessage = '';
  }
}
