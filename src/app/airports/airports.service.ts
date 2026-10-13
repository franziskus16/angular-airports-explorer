import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Airport, AirportSummary } from './airport.model';

/**
 * Reads airport data. In this demo the "API" is a set of static JSON files
 * under /data, so the app can be hosted on GitHub Pages without a server.
 * Swapping in a real backend only means changing `baseUrl`.
 */
@Injectable({ providedIn: 'root' })
export class AirportsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'data';

  getAll(): Observable<AirportSummary[]> {
    return this.http.get<AirportSummary[]>(`${this.baseUrl}/airports.json`);
  }

  getByCode(code: string): Observable<Airport> {
    return this.http.get<Airport>(
      `${this.baseUrl}/airports/${encodeURIComponent(code.toUpperCase())}.json`,
    );
  }
}
