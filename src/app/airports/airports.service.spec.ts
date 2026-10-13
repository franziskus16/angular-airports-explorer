import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AirportsService } from './airports.service';

describe('AirportsService', () => {
  let service: AirportsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AirportsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('loads the airport list', () => {
    const list = [{ code: 'BCN', name: 'El Prat', city: 'Barcelona', country: 'Spain' }];
    let result: unknown;
    service.getAll().subscribe((airports) => (result = airports));
    httpTesting.expectOne('data/airports.json').flush(list);
    expect(result).toEqual(list);
  });

  it('loads one airport by code, normalising case', () => {
    service.getByCode('bcn').subscribe();
    const req = httpTesting.expectOne('data/airports/BCN.json');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
