import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  username: string | null;
  securityKey: string | null;
}

export const initialAuthState: AuthState = {
  username: null,
  securityKey: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.loginSucceeded, (_state, { username, securityKey }) => ({
      username,
      securityKey,
    })),
    on(AuthActions.logout, () => initialAuthState),
  ),
});
