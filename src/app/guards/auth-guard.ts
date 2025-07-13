import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getTokenSession();

  if (!token) {
    return of(router.createUrlTree(['/login']));
  }

  return authService.getVerifySession(token).pipe(
    map((_response) => {
      return true;
    }),
    catchError(() => {
      authService.Logout();
      return of(router.createUrlTree(['/login']));
    })
  );
};
