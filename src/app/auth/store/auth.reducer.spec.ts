import { AuthActions } from './auth.actions';
import { authFeature, initialAuthState } from './auth.reducer';
import { selectIsLoggedIn, selectUsername } from './auth.selectors';

describe('auth state', () => {
  const reducer = authFeature.reducer;

  it('stores the user and security key on login', () => {
    const state = reducer(
      initialAuthState,
      AuthActions.loginSucceeded({ username: 'ana', securityKey: 'key-1' }),
    );
    expect(state).toEqual({ username: 'ana', securityKey: 'key-1' });
  });

  it('clears the session on logout', () => {
    const loggedIn = { username: 'ana', securityKey: 'key-1' };
    expect(reducer(loggedIn, AuthActions.logout())).toEqual(initialAuthState);
  });

  it('derives isLoggedIn from the security key', () => {
    expect(selectIsLoggedIn.projector(null)).toBe(false);
    expect(selectIsLoggedIn.projector('key-1')).toBe(true);
  });

  it('selects the username', () => {
    expect(selectUsername({ auth: { username: 'ana', securityKey: 'k' } })).toBe('ana');
  });
});
