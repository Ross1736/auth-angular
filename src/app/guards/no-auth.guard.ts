// src/app/guards/no-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { of } from 'rxjs';

export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getTokenSession();

  if (token) {
    return of(router.createUrlTree(['/']));
  }

  return of(true);
};
