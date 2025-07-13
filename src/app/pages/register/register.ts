import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import {
  IFormUser,
  IHttpErrorResponse,
  IHttpResponsePostLoginUser,
  IHttpResponsePostUser,
} from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  router = inject(Router);
  authService = inject(AuthService);

  public errorMessage: string = '';
  public isLoading: boolean = false;

  readonly form = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: (e) => this.passwordsMatchValidator(e as FormGroup) }
  );

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword) {
      const mismatch = password.value !== confirmPassword.value;
      if (mismatch) {
        confirmPassword.setErrors({ mismatch: true });
      } else {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['mismatch'];
          if (Object.keys(errors).length === 0) {
            confirmPassword.setErrors(null);
          } else {
            confirmPassword.setErrors(errors);
          }
        }
      }
    }
    return null;
  }

  get email() {
    return this.form.get('email') as FormControl<string>;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword') as FormControl<string>;
  }

  constructor() {}

  clickEvent(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  clearError() {
    this.errorMessage = '';
  }

  onRegister() {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;

    const formValue: IFormUser = {
      email: this.email.value,
      password: this.confirmPassword.value,
    };

    this.authService.postRegister(formValue).subscribe({
      next: (response: IHttpResponsePostUser) => {
        if (response.status === 201) {
          this.authService.postLogin(formValue).subscribe({
            next: (response: IHttpResponsePostLoginUser) => {
              this.authService.onSaveUserData(response.user);
              this.router.navigate(['/']);
              this.isLoading = false;
            },
            error: (_error) => this.form.reset(),
          });

          return;
        }

        this.form.reset();
        this.isLoading = false;
      },
      error: (error: IHttpErrorResponse) => {
        const msg = error.error.message;

        switch (msg) {
          case 'Violación de restricción única. El valor ya existe.':
            this.errorMessage = 'El correo ya está registrado';
            break;
          case 'Correo electrónico no válido':
            this.errorMessage = msg;
            break;
          default:
            this.errorMessage = 'Error al registrar la cuenta';
        }

        this.form.reset();
        this.isLoading = false;
      },
    });
  }
}
