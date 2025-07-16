import { Routes } from '@angular/router';
import { LayoutProtected } from './layouts/layout-protected/layout-protected';
import { authGuard } from './guards/auth-guard';
import { Home } from './pages/home/home';
import { User } from './pages/user/user';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Recovery } from './pages/recovery/recovery';
import { noAuthGuard } from './guards/no-auth.guard';
import { ResetPassword } from './pages/reset-password/reset-password';

export const routes: Routes = [
  {
    path: '',
    component: LayoutProtected,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'user',
        component: User,
      },
    ],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [noAuthGuard],
  },
  {
    path: 'recovery',
    component: Recovery,
    canActivate: [noAuthGuard],
  },
  {
    path: 'reset-password',
    component: ResetPassword,
    canActivate: [noAuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
