import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth/auth.guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'airports' },
  {
    path: 'login',
    title: 'Sign in · Airports Explorer',
    canActivate: [guestGuard],
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: 'airports',
    title: 'Airports · Airports Explorer',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./airports/airports-list/airports-list').then((m) => m.AirportsList),
  },
  {
    path: 'airports/:code',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./airports/airport-detail/airport-detail').then((m) => m.AirportDetail),
  },
  { path: '**', redirectTo: 'airports' },
];
