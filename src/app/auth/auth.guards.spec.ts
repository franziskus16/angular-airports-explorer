import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authGuard, guestGuard } from './auth.guards';
import { selectIsLoggedIn } from './store/auth.selectors';

describe('route guards', () => {
  let store: MockStore;
  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/airports/BCN' } as RouterStateSnapshot;

  const run = (guard: typeof authGuard) => TestBed.runInInjectionContext(() => guard(route, state));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore()] });
    store = TestBed.inject(MockStore);
  });

  it('authGuard lets logged-in users through', () => {
    store.overrideSelector(selectIsLoggedIn, true);
    expect(run(authGuard)).toBe(true);
  });

  it('authGuard sends guests to /login and remembers the target', () => {
    store.overrideSelector(selectIsLoggedIn, false);
    const result = run(authGuard) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/login?returnUrl=%2Fairports%2FBCN');
  });

  it('guestGuard sends logged-in users to the list', () => {
    store.overrideSelector(selectIsLoggedIn, true);
    const result = run(guestGuard) as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/airports');
  });

  it('guestGuard lets guests see the login page', () => {
    store.overrideSelector(selectIsLoggedIn, false);
    expect(run(guestGuard)).toBe(true);
  });
});
