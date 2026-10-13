import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from './store/auth.selectors';

/** Lets logged-in users through; sends everyone else to /login, remembering where they were going. */
export const authGuard: CanActivateFn = (_route, state) => {
  const isLoggedIn = inject(Store).selectSignal(selectIsLoggedIn)();
  return (
    isLoggedIn ||
    inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })
  );
};

/** Keeps logged-in users away from the login page. */
export const guestGuard: CanActivateFn = () => {
  const isLoggedIn = inject(Store).selectSignal(selectIsLoggedIn)();
  return !isLoggedIn || inject(Router).createUrlTree(['/airports']);
};
