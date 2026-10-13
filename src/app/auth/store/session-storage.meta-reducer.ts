import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.reducer';

export const SESSION_KEY = 'airports-explorer.auth';

function readSession(): AuthState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? { ...initialAuthState, ...(JSON.parse(raw) as AuthState) } : initialAuthState;
  } catch {
    return initialAuthState;
  }
}

function writeSession(state: AuthState): void {
  try {
    if (state.securityKey) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode, blocked cookies): the session
    // then simply lasts until the page is reloaded.
  }
}

/**
 * Keeps the auth slice in sessionStorage so a page reload does not log the
 * user out, while closing the tab does.
 */
export function sessionStorageMetaReducer<S extends { auth?: AuthState }>(
  reducer: ActionReducer<S>,
): ActionReducer<S> {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const next = reducer(state, action);
      return { ...next, auth: readSession() };
    }
    const next = reducer(state, action);
    if (next.auth !== state?.auth && next.auth) {
      writeSession(next.auth);
    }
    return next;
  };
}
