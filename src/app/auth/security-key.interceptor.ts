import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSecurityKey } from './store/auth.selectors';

/** Adds the session's security key to every request once the user is logged in. */
export const securityKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const securityKey = inject(Store).selectSignal(selectSecurityKey)();
  if (!securityKey) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { securityKey } }));
};
