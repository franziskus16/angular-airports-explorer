import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { securityKeyInterceptor } from './security-key.interceptor';
import { selectSecurityKey } from './store/auth.selectors';

describe('securityKeyInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        provideHttpClient(withInterceptors([securityKeyInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => httpTesting.verify());

  it('adds the session key to requests', () => {
    store.overrideSelector(selectSecurityKey, 'abc-123');
    http.get('/data').subscribe();
    expect(httpTesting.expectOne('/data').request.headers.get('securityKey')).toBe('abc-123');
  });

  it('leaves requests untouched when logged out', () => {
    store.overrideSelector(selectSecurityKey, null);
    http.get('/data').subscribe();
    expect(httpTesting.expectOne('/data').request.headers.has('securityKey')).toBe(false);
  });
});
