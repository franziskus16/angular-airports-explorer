import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { securityKeyInterceptor } from './auth/security-key.interceptor';
import { authFeature } from './auth/store/auth.reducer';
import { sessionStorageMetaReducer } from './auth/store/session-storage.meta-reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([securityKeyInterceptor])),
    provideStore(
      { [authFeature.name]: authFeature.reducer },
      { metaReducers: [sessionStorageMetaReducer] },
    ),
  ],
};
