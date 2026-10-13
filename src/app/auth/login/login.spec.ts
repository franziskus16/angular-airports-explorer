import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthActions } from '../store/auth.actions';
import { Login } from './login';

describe('Login', () => {
  async function setup() {
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideMockStore(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(Login);
    const store = TestBed.inject(MockStore);
    const router = TestBed.inject(Router);
    vi.spyOn(store, 'dispatch');
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const type = (selector: string, value: string) => {
      const input = el.querySelector<HTMLInputElement>(selector)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const submit = async () => {
      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    };
    return { fixture, store, router, el, type, submit };
  }

  it('shows validation errors and does not log in with empty fields', async () => {
    const { store, el, submit } = await setup();
    await submit();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(el.textContent).toContain('Enter a username');
    expect(el.textContent).toContain('Enter a password');
  });

  it('logs in with a generated security key and opens the list', async () => {
    const { store, router, type, submit } = await setup();
    type('#username', '  francesc ');
    type('#password', 'demo1234');
    await submit();

    const action = vi.mocked(store.dispatch).mock.calls[0][0] as unknown as ReturnType<
      typeof AuthActions.loginSucceeded
    >;
    expect(action.type).toBe(AuthActions.loginSucceeded.type);
    expect(action.username).toBe('francesc');
    expect(action.securityKey).toMatch(/^[0-9a-f-]{36}$/);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/airports');
  });

  it('returns to the page the user was trying to open', async () => {
    const { fixture, router, type, submit } = await setup();
    fixture.componentRef.setInput('returnUrl', '/airports/LIS');
    type('#username', 'francesc');
    type('#password', 'demo1234');
    await submit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/airports/LIS');
  });

  it('ignores external return URLs', async () => {
    const { fixture, router, type, submit } = await setup();
    fixture.componentRef.setInput('returnUrl', 'https://example.com');
    type('#username', 'francesc');
    type('#password', 'demo1234');
    await submit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/airports');
  });
});
