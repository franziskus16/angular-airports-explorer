import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AirportSummary } from '../airport.model';
import { AirportsList, filterAirports } from './airports-list';

const AIRPORTS: AirportSummary[] = [
  {
    code: 'BCN',
    name: 'Josep Tarradellas Barcelona–El Prat Airport',
    city: 'Barcelona',
    country: 'Spain',
  },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain' },
  { code: 'LIS', name: 'Humberto Delgado Airport', city: 'Lisbon', country: 'Portugal' },
];

describe('filterAirports', () => {
  it('returns everything for an empty query', () => {
    expect(filterAirports(AIRPORTS, '  ')).toHaveLength(3);
  });

  it('matches code, city and country, ignoring case', () => {
    expect(filterAirports(AIRPORTS, 'lis').map((a) => a.code)).toEqual(['LIS']);
    expect(filterAirports(AIRPORTS, 'SPAIN').map((a) => a.code)).toEqual(['BCN', 'MAD']);
  });

  it('ignores accents', () => {
    expect(filterAirports(AIRPORTS, 'suarez').map((a) => a.code)).toEqual(['MAD']);
  });
});

describe('AirportsList', () => {
  async function setup() {
    TestBed.configureTestingModule({
      imports: [AirportsList],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(AirportsList);
    const httpTesting = TestBed.inject(HttpTestingController);
    // Render once so the resource fires its request; don't wait for stability
    // here, because the app stays "busy" until the pending request is flushed.
    fixture.detectChanges();
    TestBed.tick();
    return { fixture, httpTesting, el: fixture.nativeElement as HTMLElement };
  }

  it('renders one card per airport', async () => {
    const { fixture, httpTesting, el } = await setup();
    httpTesting.expectOne('data/airports.json').flush(AIRPORTS);
    await fixture.whenStable();
    expect(el.querySelectorAll('app-airport-card')).toHaveLength(3);
  });

  it('filters as the user types', async () => {
    const { fixture, httpTesting, el } = await setup();
    httpTesting.expectOne('data/airports.json').flush(AIRPORTS);
    await fixture.whenStable();

    const input = el.querySelector<HTMLInputElement>('#search')!;
    input.value = 'portugal';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(el.querySelectorAll('app-airport-card')).toHaveLength(1);
    expect(el.textContent).toContain('Lisbon');
  });

  it('shows an error with a retry button when loading fails', async () => {
    const { fixture, httpTesting, el } = await setup();
    httpTesting
      .expectOne('data/airports.json')
      .flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain("couldn't load");
  });
});
